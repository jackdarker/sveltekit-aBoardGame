mkdir build

echo those files are needed to fetch nodemodules
copy package.json build
copy package-lock.json build

echo fetch node modules
cd build
npm ci

echo create enviroment-file
copy .env build /-Y
