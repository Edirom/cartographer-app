# Getting Started

Choose the option appropriate for your platform.

## Browser

No installation is required. Open the application URL provided by your
institution, for example <https://cartographer-app.zenmem.de/>.

## Native application

Cartographer can be distributed as a native application for Windows, macOS,
Linux, and Android. Download the package for your platform from the
[releases page](https://github.com/Edirom/cartographer-app/releases) or use the
download provided by your institution.

Only install native packages from a trusted source. Android packages may need
to be approved for installation if they are distributed outside an app store;
follow your institution's installation guidance.

## GitHub login on Android and desktop

Native Tauri applications use GitHub Device Flow rather than redirecting back
to the application through a callback URL:

1. Open the application menu and select **Login with GitHub**.
2. Copy the temporary code displayed by Cartographer.
3. Open <https://github.com/login/device> in a browser.
4. Enter the code and authorize Cartographer.
5. Return to Cartographer and wait for login to complete automatically.

The browser can be on the same device or another trusted device. Only enter a
code when you initiated the login yourself. See
[Importing from a GitHub repository](./actions.md#importing-from-a-github-repository)
for the complete workflow.
