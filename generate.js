const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

const icons = JSON.parse(readFileSync(join(__dirname, 'icons.json'), {
  encoding: 'utf8',
}));

const logoPath = join(__dirname);
const iconsPath = join(__dirname, './dist');
const tmpPath = join(__dirname, './tmp');

const commands = [
  `rm -rf ${iconsPath}`,
  `rm -rf ${tmpPath}`,
  `mkdir -p ${iconsPath}`,
  `mkdir -p ${tmpPath}`,
];

const svgList = [
  'logo',
];

commands.push(`convert ${logoPath}/logo.png -resize 512x512 ${iconsPath}/logo.png`);
commands.push(`pngquant --quality 0-1 --force --speed 1 ${iconsPath}/logo.png --output ${iconsPath}/logo.png`);

commands.push(`convert ${logoPath}/logo.png -define icon:auto-resize=64,48,32,24,16 ${iconsPath}/favicon.ico`);

commands.push(`convert ${logoPath}/logo.png -background white -alpha remove -alpha off ${tmpPath}/logo.png`);


Object.keys(icons.apple).forEach((name) => {
  const iconData = icons.apple[name];
  commands.push(`convert ${tmpPath}/logo.png -resize ${iconData.width}x${iconData.height} ${iconsPath}/${name}`);
  commands.push(`pngquant --quality 0-1 --force --speed 1 ${iconsPath}/${name} --output ${iconsPath}/${name}`);
});

Object.keys(icons.defaults).forEach((name) => {
  const iconData = icons.defaults[name];
  commands.push(`convert ${logoPath}/logo.png -resize ${iconData.width}x${iconData.height} ${iconsPath}/${name}`);
  commands.push(`pngquant --quality 0-1 --force --speed 1 ${iconsPath}/${name} --output ${iconsPath}/${name}`);
});

execSync(commands.join(' && '));