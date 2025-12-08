# Web OTP
Web OTP is a web-based OTP authenticator.

## What it does:
- Scan QR code images of OTP
- Refresh once in a while (every 30 seconds) for a new OTP

## Notes:
- QR code images are deleted immediately as soon as OTP processing is complete
- OTP Auth data will be saved locally in the browser using the Javascript LocalStorage API
- It will not save your data online

## Issues:
- May not detect QR code images taken by camera (will fix soon)