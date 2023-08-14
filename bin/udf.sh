#!/usr/bin/bash

rm -rf ~/.gnome
rm -rf ~/.local/share/applications/chrome-*.desktop

if ! grep -q ozone /usr/share/applications/visual-studio-code-insiders.desktop; then
  sed -i 's/\(Exec=[^%]*\)\(%F\)/\1--ozone-platform-hint=auto --enable-features=WaylandWindowDecorations \2/' /usr/share/applications/visual-studio-code-insiders.desktop
fi

if ! grep -q ozone /usr/share/applications/visual-studio-code-insiders-url-handler.desktop; then
  sed -i 's/\(Exec=[^%]*\)\(%U\)/\1--ozone-platform-hint=auto --enable-features=WaylandWindowDecorations \2/' /usr/share/applications/visual-studio-code-insiders-url-handler.desktop
fi

if ! grep -q ozone /usr/share/applications/discord.desktop; then
  sed -i 's/Exec=.*/\0 --enable-features=UseOzonePlatform --ozone-platform=wayland/' /usr/share/applications/discord.desktop
fi

if ! grep -q ozone /usr/share/applications/obsidian.desktop; then
  sed -i 's/\(Exec=[^%]*\)\(%U\)/\1--ozone-platform=wayland --enable-features=UseOzonePlatform,WaylandWindowDecorations --disable-gpu \2/' /usr/share/applications/obsidian.desktop
fi

if ! grep -q ozone /usr/share/applications/mongodb-compass.desktop; then
  sed -i 's/\(Exec=[^%]*\)\(%U\)/\1--enable-features=UseOzonePlatform,WaylandWindowDecorations --ozone-platform=wayland --ignore-additional-command-line-flags \2/' /usr/share/applications/mongodb-compass.desktop
fi
