#### Gulp Tasks

- `docker run --rm -it -w /build -v "$PWD:/build:delegated" node:dubnium npm run gulp` the default task that builds everything
- `docker run --rm -it -w /build -v "$PWD:/build:delegated" -p 3000:3000 node:dubnium npm run gulp watch` browserSync opens the project in your default browser and live reloads when changes are made
- `docker run --rm -it -w /build -v "$PWD:/build:delegated" node:dubnium npm run gulp build --prod` to build compressed versions of html

## AWS CLI

docker run --rm -it -v "$PWD:/project:delegated" -e "AWS_ACCESS_KEY_ID=" -e "AWS_SECRET_ACCESS_KEY=" -e "AWS_DEFAULT_REGION=" mesosphere/aws-cli

## Publishing

docker run --rm -it -v "$PWD:/project:delegated" -e "AWS_ACCESS_KEY_ID=" -e "AWS_SECRET_ACCESS_KEY=" -e "AWS_DEFAULT_REGION=" mesosphere/aws-cli s3 sync . s3://BUCKET/ --exclude .git\* --exclude node_modules/\* --acl public-read

# Video conversion

ffmpeg -i 16-9\(triniti\).mov -vf scale=960:-1 -vcodec libx264 -pix_fmt yuv420p -profile:v baseline -level 3 out.mov