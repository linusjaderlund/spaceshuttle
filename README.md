# 🚀 spaceshuttle-deploy

## About

**spaceshuttle-deploy** is a command-line tool for easy deploy of your code to a server. The tool wraps around [ssh2-sftp-client](https://www.npmjs.com/package/ssh2-sftp-client) (developed by [jyu213](https://www.npmjs.com/~jyu213) and [theophilusx](https://www.npmjs.com/~theophilusx)) to create a convenient way to deploy. Originally developed to be used with `npx` to easily configure a build and deploy pipeline with `npm run`.

## Usage with **npx**

``` bash
npx spaceshuttle-deploy [options]
# option format: <key>=<value>
```

## Usage with **npm install** globally

``` bash
npm install -g spaceshuttle-deploy
```

and then...

``` bash
spaceshuttle-deploy [options]
# option format: <key>=<value>
```

## Example usage

``` bash
npx spaceshuttle-deploy host=sftp.yourhost.com privateKey=~/.ssh/id_rsa serverPath=www
```

**Note:** `npx` can be neglected if spaceshuttle-deploy is installed globally

## Command-line options

Options are formatted `<key>=<value>` and can be used in combination separated by space

- **host** - URL to server
- **port** - server port
  - **default**: 22
- **username** - username used to authenticate you
- **password** - password used to authenticate you
- **privateKey** - local path to your private key user to authenticate you (recommended)
- **passphrase** - passphrase used together with private key to authenticated you
  - **default**: empty string (`''`) if private key is specified
- **localPath** - path to directory which you want to deploy
  - **default**: current terminal path
- **serverPath** - path to directory which you want to deploy to, **note**: relative to server root
  - **default**: empty string (`''`), root of server

## sftp.json options

Same options as for the command line can be set using sftp.json
and should be present in the same directory as your terminal is
pointing when running `spaceshuttle-deploy`. **Note that any options set in the command-line will override sftp.json**. Example of such file could look like this:

``` json
{
  "host": "sftp.yourserver.com",
  "port": 4444,
  "localPath": "dist",
  "serverPath": "www",
  "username": "youruser",
  "password": "******"
}
```
