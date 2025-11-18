# 🎯 SIMPLE MIKROTIK SETUP GUIDE
## Step-by-Step Instructions for RBAC1200W-IN

---

## 📋 WHAT YOU NEED:
1. Your MikroTik router (RBAC1200W-IN)
2. Computer connected to the router
3. Winbox software (download from mikrotik.com) OR use your browser

---

## 🚀 STEP 1: Open MikroTik Configuration

### Option A: Using Winbox
1. Download Winbox from: https://mikrotik.com/download
2. Open Winbox
3. Click "Neighbors" to find your router
4. Double-click your router to connect
5. Login with your username/password

### Option B: Using Browser
1. Open your web browser
2. Type: `http://192.168.88.1` (or your router's IP)
3. Login with your username/password

### Option C: Using SSH
1. Open command prompt/terminal
2. Type: `ssh admin@192.168.88.1`
3. Login with your password

---

## 🚀 STEP 2: Check Your WiFi Interface Name

**In Winbox or Terminal, type this command:**
```
/interface wireless print
```

**Look for your WiFi interface name** - it will show something like:
- `wlan1`
- `wlan2`
- `wifi1`
- `wifi2`

**Write down this name!** You'll need it in the next step.

---

## 🚀 STEP 3: Run These Commands

**Copy and paste these commands ONE BY ONE into your MikroTik terminal:**

### First, check your WiFi interface (replace `wlan1` with your interface name):

```mikrotik
# Check what interfaces you have
/interface print
```

### Configure Hotspot (REPLACE `wlan1` with YOUR WiFi interface name):

```mikrotik
# Set IP address for hotspot
/ip address add address=192.168.88.1/24 interface=wlan1 comment="Hotspot"
```

```mikrotik
# Create IP pool for users
/ip pool add name=hotspot-pool ranges=192.168.88.10-192.168.88.254
```

```mikrotik
# Create DHCP server
/ip dhcp-server add interface=wlan1 name=hotspot-dhcp address-pool=hotspot-pool disabled=no
```

```mikrotik
# Create hotspot profile
/ip hotspot profile add name=busowa-wifi hotspot-address=192.168.88.1 dns-name=busowa-wifi-hotspot.vercel.app html-directory=flash/hotspot http-cookie-lifetime=1d http-proxy=0.0.0.0:0 login-by=http-pap,http-chap,mac
```

```mikrotik
# Create hotspot server (REPLACE wlan1 with YOUR WiFi interface)
/ip hotspot add name=busowa-wifi interface=wlan1 profile=busowa-wifi address-pool=hotspot-pool disabled=no
```

```mikrotik
# Allow access to Vercel website
/ip hotspot walled-garden ip add action=accept dst-host=busowa-wifi-hotspot.vercel.app
```

```mikrotik
/ip hotspot walled-garden ip add action=accept dst-host=*.vercel.app
```

```mikrotik
# Create user profile
/ip hotspot user profile add name=default rate-limit=0/0 shared-users=1 keepalive-timeout=00:02:00
```

```mikrotik
# Enable NAT for internet (REPLACE ether1 with YOUR internet interface)
/ip firewall nat add chain=srcnat action=masquerade out-interface=ether1 comment="Internet NAT"
```

```mikrotik
# Enable the hotspot
/ip hotspot enable busowa-wifi
```

---

## 🚀 STEP 4: Upload Login Page

### Method 1: Using Winbox (Easiest)

1. In Winbox, go to **Files** (left menu)
2. Click **Upload** button
3. Select the file: `mikrotik-login-redirect.html`
4. After upload, **right-click** on the file
5. Select **Rename** → Change name to: `login.html`
6. **Right-click** again → Select **Move** → Go to `flash/hotspot/` folder → Click OK

### Method 2: Using Webfig

1. Go to: `http://192.168.88.1` in browser
2. Click **Files** menu
3. Click **Upload**
4. Select `mikrotik-login-redirect.html`
5. Rename to `login.html`
6. Move to `flash/hotspot/` folder

---

## 🚀 STEP 5: Test It!

1. **Connect your phone to the WiFi network**
2. **Open any website** (like google.com)
3. **You should be redirected to:** `https://busowa-wifi-hotspot.vercel.app/`
4. **If you see your payment page, it's working! ✅**

---

## ❓ TROUBLESHOOTING

### Problem: I don't know my WiFi interface name
**Solution:**
```
/interface wireless print
```
Look for the interface that has "running" status

### Problem: I don't know my internet/WAN interface
**Solution:**
```
/ip route print
```
Look for the interface with "gateway" - that's your internet interface

### Problem: Hotspot not working
**Solution:** Check if hotspot is enabled:
```
/ip hotspot print
```
Should show `disabled=no`

### Problem: Users can't access Vercel
**Solution:** Check walled-garden:
```
/ip hotspot walled-garden ip print
```
Should show `busowa-wifi-hotspot.vercel.app`

---

## 📞 NEED HELP?

If you get stuck on any step, tell me:
1. Which step you're on
2. What error message you see (if any)
3. What happens when you try

---

## ✅ CHECKLIST

- [ ] Opened MikroTik Winbox/Browser
- [ ] Found WiFi interface name
- [ ] Ran hotspot configuration commands
- [ ] Uploaded login.html file to flash/hotspot/
- [ ] Enabled hotspot
- [ ] Tested with phone - redirected to Vercel site

---

## 🎉 WHEN IT'S DONE:

Users will:
1. Connect to WiFi
2. Get redirected to your payment page automatically
3. Pay for packages
4. Get username/password
5. Log in to access internet

