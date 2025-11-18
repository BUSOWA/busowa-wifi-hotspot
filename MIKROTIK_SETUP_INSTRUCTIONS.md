# MikroTik RBAC1200W-IN Setup Instructions
## BUSOWA WIFI HOTSPOT - Vercel Integration

### Prerequisites
1. Access to MikroTik RouterOS (via Winbox, Webfig, or SSH)
2. RouterOS version 6.0 or higher (recommended 7.0+)
3. WiFi interface configured and enabled

---

## Step 1: Identify Your Interfaces

**Check WiFi Interface:**
```
/interface wireless print
```
Note the interface name (usually `wlan1` or `wlan2`)

**Check WAN Interface:**
```
/interface ethernet print
```
Note the interface name (usually `ether1` or `ether2`)

---

## Step 2: Configure Hotspot

**Copy and paste these commands one by one, or use the mikrotik-config.txt file:**

```mikrotik
# Set IP address for hotspot interface (adjust wlan1 to your WiFi interface)
/ip address add address=192.168.88.1/24 interface=wlan1 comment="Hotspot Interface"

# Create IP pool
/ip pool add name=hotspot-pool ranges=192.168.88.10-192.168.88.254

# Create DHCP server
/ip dhcp-server add interface=wlan1 name=hotspot-dhcp address-pool=hotspot-pool disabled=no

# Create hotspot profile
/ip hotspot profile add name=busowa-wifi \
    hotspot-address=192.168.88.1 \
    dns-name=busowa-wifi-hotspot.vercel.app \
    html-directory=flash/hotspot \
    http-cookie-lifetime=1d \
    http-proxy=0.0.0.0:0 \
    login-by=http-pap,http-chap,mac \
    split-user-domain=yes \
    use-radius=no

# Create hotspot server
/ip hotspot add name=busowa-wifi \
    interface=wlan1 \
    profile=busowa-wifi \
    address-pool=hotspot-pool \
    disabled=no

# Create default user profile
/ip hotspot user profile add name=default \
    rate-limit=0/0 \
    shared-users=1 \
    keepalive-timeout=00:02:00 \
    status-autorefresh=00:00:30

# Allow access to Vercel
/ip hotspot walled-garden ip add action=accept dst-host=busowa-wifi-hotspot.vercel.app
/ip hotspot walled-garden ip add action=accept dst-host=*.vercel.app
/ip hotspot walled-garden ip add action=accept dst-host=*.momoapi.mtn.com comment="MTN API"
/ip hotspot walled-garden ip add action=accept dst-host=*.airtel.africa comment="Airtel API"

# Configure NAT (adjust ether1 to your WAN interface)
/ip firewall nat add chain=srcnat action=masquerade out-interface=ether1 comment="NAT for Internet"

# Firewall rules
/ip firewall filter add chain=input action=accept connection-state=established,related in-interface=wlan1
/ip firewall filter add chain=input action=accept protocol=icmp in-interface=wlan1
/ip firewall filter add chain=input action=accept protocol=tcp dst-port=80 in-interface=wlan1
/ip firewall filter add chain=input action=accept protocol=tcp dst-port=443 in-interface=wlan1
/ip firewall filter add chain=input action=accept protocol=udp dst-port=53 in-interface=wlan1
/ip firewall filter add chain=forward action=accept in-interface=wlan1 out-interface=ether1
/ip firewall filter add chain=forward action=accept in-interface=ether1 out-interface=wlan1 connection-state=established,related
```

---

## Step 3: Upload Custom Login Page

**Method 1: Using Winbox**
1. Open Winbox
2. Go to Files → Upload
3. Upload the `mikrotik-login-redirect.html` file
4. Rename it to `login.html`
5. Move it to `flash/hotspot/` directory

**Method 2: Using FTP**
1. Enable FTP on MikroTik:
   ```
   /ip service enable ftp
   ```
2. FTP to your router (use admin credentials)
3. Upload `mikrotik-login-redirect.html` to `/flash/hotspot/login.html`

**Method 3: Using Webfig**
1. Go to Files
2. Click "Upload"
3. Select the HTML file
4. Rename to `login.html`
5. Move to `flash/hotspot/`

---

## Step 4: Enable Hotspot

```mikrotik
/ip hotspot enable busowa-wifi
```

---

## Step 5: Test

1. Connect to the WiFi network
2. Open a browser
3. You should be redirected to: `https://busowa-wifi-hotspot.vercel.app/`
4. Users can now:
   - Pay for packages
   - Get voucher credentials
   - Login with username/password

---

## Step 6: Create Test User (Optional)

For testing authentication, create a test user:
```mikrotik
/ip hotspot user add name=testuser password=testpass profile=default
```

---

## Important Notes

1. **IP Address**: Adjust `192.168.88.1` if it conflicts with your network
2. **Interface Names**: Replace `wlan1` with your actual WiFi interface name
3. **WAN Interface**: Replace `ether1` with your actual internet/WAN interface
4. **SSL Certificate**: Vercel uses HTTPS, ensure MikroTik allows HTTPS connections
5. **DNS**: Make sure hotspot users can resolve DNS (usually automatic)

---

## Troubleshooting

**Users can't access Vercel site:**
- Check walled-garden rules: `/ip hotspot walled-garden ip print`
- Ensure HTTPS (port 443) is allowed
- Check DNS resolution: `/ip dns print`

**Hotspot not working:**
- Check if hotspot is enabled: `/ip hotspot print`
- Verify interface is correct: `/interface wireless print`
- Check DHCP server: `/ip dhcp-server print`

**Can't access internet after login:**
- Check NAT rules: `/ip firewall nat print`
- Verify masquerade rule is active
- Check firewall forward rules

---

## Support

For issues, check:
- MikroTik logs: `/log print`
- Hotspot active users: `/ip hotspot active print`
- Hotspot users: `/ip hotspot user print`

