# User Segmentation API

Example of a simple implementation to build a user segmentation api on top of Redis.
This can for instance be used to categorize users into segment for ads or recommendations.

The client _should_ post the tags each consumed video. This backend will set the tags on the user and increment its weight if it already exists. over time, default 30 days, the weight will decrease. So the segmentation of interests should always be up to date with the users latests interests.

#### Related repositories

- [Ratings API](https://github.com/Eyevinn/ratings-api)
- [Favorites API](https://github.com/Eyevinn/favorites-api)
- [Continue Watching API](https://github.com/Eyevinn/continue-watching-api)
- [Stream Limit API](https://github.com/Eyevinn/stream-limit-api)

## Requirements

- nodejs v10+
- redis

## Usage
- `git clone git@github.com:Eyevinn/user-segmentation-api.git`
- `cd user-segmentation-api`
- `npm install`
- Start Redis locally or insert the needed keys into the .env file
- `npm start` to run the server

## Endpoints

- POST `/segmentation/:userId/:tags` To set or update the weight of the tags on the user (tags comma separated)
- GET `/user/:userId/segments` To get a sorted list of the segments which the user belongs to. Weighted.
- GET `/user/:userId/interest`To get a single interest randomly selected, but with weight in concern.

Examples are available in the `example.http` file.

## Environment variables

- `NODE_ENV` if set to `development` there will be some logging made into the console
- `REDIS_URL` if not local
- `REDIS_PORT` if not default (6379)
- `REDIS_AUTH`
- `SEGMENTATION_TTL` for how long a segment input should be valid, before decreased in weight. (Default 30 days)

## Docker

A `docker-compose` config file is provided that takes care of building the image and running this container together with a Redis db container.

Start the service:

- `docker-compose up`

Stop the service:

- `docker-compose down`

The Redis container is using `/tmp` as persistant storage but this can be changed by modifying the `docker-compose.yml` file. Change:

```
    volumes:
      - /tmp:/bitnami/redis/data
```

to where you want the persistant storage to be located.

## About Eyevinn Technology

Eyevinn Technology is an independent consultant firm specialized in video and streaming. Independent in a way that we are not commercially tied to any platform or technology vendor.

At Eyevinn, every software developer consultant has a dedicated budget reserved for open source development and contribution to the open source community. This give us room for innovation, team building and personal competence development. And also gives us as a company a way to contribute back to the open source community.

Want to know more about Eyevinn and how it is to work here. Contact us at work@eyevinn.se!
