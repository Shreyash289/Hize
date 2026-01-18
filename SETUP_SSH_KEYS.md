# Setup SSH Key Authentication for VPS

## ✅ You Already Have SSH Keys!

Your public key has been copied to clipboard. Here's what to do:

## Method 1: Add via Vultr Dashboard (Easiest)

1. **In the Vultr SSH Keys page** (where you are now):
   - Click **"Add SSH Key"** button
   - Give it a name: `MacBook-Air-5`
   - Paste your public key (already copied to clipboard)
   - Click **"Add SSH Key"**

2. **Apply to your server:**
   - Go to your server (65.20.84.46)
   - Settings → Reinstall → Select your SSH key
   - Or manually add it (Method 2 below)

## Method 2: Add Directly to VPS (Faster)

While SSH'd into VPS, run:

```bash
# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your public key to authorized_keys
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAUZmWMGhaSaW/qf7QUcOU8je9VvC7Cxux2lFKs1bUtj harshag954@gmail.com" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys

# Test from your local machine (new terminal)
ssh -i ~/.ssh/id_ed25519 root@65.20.84.46
```

## Method 3: Use ssh-copy-id (Automatic)

From your local machine:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@65.20.84.46
```

You'll be prompted for password once, then never again!

## After Setup

Once SSH keys are configured, you can:

1. **Access without password:**
   ```bash
   ssh root@65.20.84.46
   ```

2. **Use in scripts:**
   ```bash
   scp file.txt root@65.20.84.46:/path/
   rsync -avz root@65.20.84.46:/path/
   ```

3. **Automated deployments** (no password prompts)

---

**Your Public Key (already copied to clipboard):**
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAUZmWMGhaSaW/qf7QUcOU8je9VvC7Cxux2lFKs1bUtj harshag954@gmail.com
```

