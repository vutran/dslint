# dslint

## Install

```
$ npm i -g dslint
```

## Usage

```
$ FIGMA_TOKEN=my-figma-token dslint abcdefg1234567890
```

## API

```
import {dslint} from 'dslint';

const fileKey = 'abcdefg1234567890';
const token = 'my-figma-token';

dslint(fileKey, token).then(failures => {
  console.log(failures);
});
```
