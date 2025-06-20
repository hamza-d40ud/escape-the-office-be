# eto-backend

REPLACE eto with project name

## For Dev:
```
docker-compose -p eto --env-file .env.development up --build -d
```
### To create a new migration file
```
npx sequelize-cli migration:generate --name <migration-name>
```

### To run migrations (apply pending migrations)
```
docker exec -it eto_backend npx sequelize-cli db:migrate
```

### To create seed file
```
npx sequelize-cli seed:generate --name <name>
```

### To run seeds (apply pending seeds)
```
docker exec -it eto_backend npx sequelize-cli db:seed:all
```

### To undo all seeds
```
docker exec -it eto_backend npx sequelize-cli db:seed:undo:all
```

## For Prod:
```
docker-compose -p eto --env-file .env.production up --build -d
```
### Monitor logs
```
tail -f logs/error-$(date +%Y-%m-%d).log
tail -f logs/combined-$(date +%Y-%m-%d).log
```
### You can monitor the log directory size with:
```du -sh logs/```

### And check the number of log files with:
```ls -l logs/ | wc -l```