* Связи находятся в файле **`shcema.drawio`**
* ФОТО получить можно по url: `<host>/<photo.jpeg>` или `<host>/<dir in server/static folder>/<photo.jpg>`
## `/api`
## -----------------------------------------
### Actor: `/actor`
#### Пример  хранения в БД
```
id              | 2
firstName       | Arnold
lastName        | Schwarzenegger
middleName      | 
gender          | M
dateOfBirth     | 1947-05-20
height          | 188
clothesSize     | 65
description     | one two posle 5 mama papa prosti. Ya soshla s uma!
directory       | ArnoldSchwarzenegger
linkToKinoTeatr | 
linkToFilmTools | 
linkToKinopoisk | 
videoCode       | 
photos          | {94fad05a-7576-42bd-9f43-3710b4f40ab0.jpg,1a1d47d8-1173-49cc-a318-18f1c16b50a5.jpg}
createdAt       | 2025-07-21 21:24:51.929136
updatedAt       | 2025-07-21 21:24:51.929136

agent_id        | 2
eye_color_id    | 1
city_id         | 2
```
#### Пример вывода `Actor type`
```json
{
  "id": 2,
  "firstName": "Arnold",
  "lastName": "Schwarzenegger",
  "middleName": null,
  "gender": "M",
  "dateOfBirth": "1947-05-20",
  "height": 188,
  "clothesSize": 65,
  "description": "one two posle 5 mama papa prosti. Ya soshla s uma!",
  "directory": "ArnoldSchwarzenegger",
  "linkToKinoTeatr": null,
  "linkToFilmTools": null,
  "linkToKinopoisk": null,
  "videoCode": null,
  "photos": [
    "94fad05a-7576-42bd-9f43-3710b4f40ab0.jpg",
    "1a1d47d8-1173-49cc-a318-18f1c16b50a5.jpg"
  ],
  "createdAt": "2025-07-21T18:24:51.929Z",
  "updatedAt": "2025-07-21T18:24:51.929Z",
  "agent": {
    "id": 2,
    "firstName": "Алина",
    "lastName": "Волкова",
    "middleName": "Вячеславовна",
    "email": "volkhova@mail.com",
    "phone": "9999999999",
    "description": "agent",
    "photo": "AlinaVolkhovaVyacheslavovna.jpg",
    "telegram": "telega",
    "vk": "vk",
    "isAdmin": true,
    "createdAt": "2025-07-21T17:51:18.810Z",
    "updatedAt": "2025-07-21T18:18:26.927Z"
  },
  "eyeColor": {
    "id": 1,
    "name": "green"
  },
  "city": {
    "id": 2,
    "name": "Moskow"
  },
  "languages": [
    {
      "id": 1,
      "name": "russian"
    },
    {
      "id": 2,
      "name": "belorussian"
    }
  ]
}
```

#### Пример вывода `ShortActor type`
```json
{
	"id": 4,
	"firstName": "Beautiful",
	"lastName": "Girl",
	"directory": "BeautifulGirl"
}
```

#### POST
##### `/create` ++++++++++++++++
**body:**

| поле                    | тип                                               |
| ----------------------- | ------------------------------------------------- |
| firstName               | `string`                                          |
| lastName                | `string`                                          |
| agentId                 | `int`                                             |
| gender                  | `string` ('M' или 'W')                            |
| dateOfBirth             | `string` (YYYY-MM-DD, <br>`Date` data type in js) |
| avatar                  | `File` (фото .jpeg)                               |
| photos                  | `File[]`(фотографии .jpeg)                        |
| **Необязательные поля** |                                                   |
| middleName?             | `string`                                          |
| city?                   | `string`                                          |
| height?                 | `int`                                             |
| clothesSize?            | `int`                                             |
| description             | `string`                                          |
| **Ссылки**              |                                                   |
| video?                  | `string`                                          |
| kinoTeatr               | `string`                                          |
| filmTools               | `string`                                          |
| kinopoisk               | `string`                                          |
| **Ключи на таблицы**    |                                                   |
| languages?              | `string[]`                                        |
| eyeColor?               | `string`                                          |
| city?                   | `string`                                          |
**response:**
`Actor type`
##### `/delete` ++++++++++++++++
**body:**

| поле | тип    |
| ---- | ------ |
| id   | number |
**response:**
status 200
```json
true
```

##### `/edit` ++++++++++++++++
**body:**

| поле                       | тип                         |
| -------------------------- | --------------------------- |
| id                         | `int`                       |
| firstName?                 | `string`                    |
| lastName?                  | `string`                    |
| middleName?                | `string`                    |
| dateOfBirth?<br>           | `Date` data type in js)<br> |
| agentId?                   | `int`                       |
| gender?                    | `string` ('M' или 'W')      |
| height?                    | `int`                       |
| clothesSize?               | `int`                       |
| description?               | `string`                    |
| **ссылки:**                |                             |
| video?                     | `string`                    |
| kinoTeatr?                 | `string`                    |
| filmTools?                 | `string`                    |
| kinopoisk?                 | `string`                    |
| **создаются новые связи:** |                             |
| languages?                 | `string[]`                  |
| eyeColor?                  | `string`                    |
| city?                      | `string`                    |
**response:**
`Actor type`
##### `/edit/changeAvatar` ++++++++++++++++
**query:**

| поле      | тип                 |
| --------- | ------------------- |
| id        | `int`               |
| newAvatar | `File` (фото .jpeg) |
**response:**
status 200
```json
true
```
##### `/edit/changeOrder` ++++++++++++++++
При запросе change order нужно поменять порядок фото в поле actor.photos 
Порядок задается индексами в массиве, элементы массива string -- наименования файлов
{"1.jpg", "5.jpg", "3.jpg"}

**query:**

| поле        | тип                                                                    |
| ----------- | ---------------------------------------------------------------------- |
| id          | `int`                                                                  |
| currIdx     | `int` (индекс перемещаемого фото)                                      |
| putAfterIdx | `int` (индекс, после которого перемещать. От -1 до последнего индекса) |
**response:**
`Actor type`
##### `/edit/deleteFromAlbum` ++++++++++++++++
**query:**

| поле      | тип                 |
| --------- | ------------------- |
| id        | `int`               |
| newAvatar | `File` (фото .jpeg) |
**response:**
status 200
```json
true
```
##### `/filter` ++++++++++++++++
**body:**

| поле        | тип                                                                                    |
| ----------- | -------------------------------------------------------------------------------------- |
| search      | `string` (запрос из поля поиска по имени,<br>ищет в `lastName, firstName, middleName`) |
| agentId     | `int`                                                                                  |
| minAge      | `int`                                                                                  |
| maxAge      | `int`                                                                                  |
| clothesSize | `int`                                                                                  |
| gender      | `string` ('M' или 'W')                                                                 |
| minHeight   | `int`                                                                                  |
| maxHeight   | `int`                                                                                  |
| eyeColorIds | `int[]`                                                                                |
| cityIds     | `int[]`                                                                                |
| languageIds | `int[]`                                                                                |
**response:**
`ShortActor type[]` 
#### GET 
##### `/:id` ++++++++++++++++
\---
**response:**
`Actor type`
##### `/get/men` && `/get/women` ++++++++++++++++
изначально на сайте должно было быть 3 страницы: `Актёры`, `Актрисы`, `Агенты`. На данный момент функционал отличается, актеры и актрисы будут показаны на 1 странице в порядке фамилий. Роутинг было решено оставить.
\---
**response:**
`ShortActor type[]`
##### `/` ++++++++++++++++
\---
**response:**
`ShortActor type[]`
## -----------------------------------------
## Agent: `/agent`
##### Пример хранения в БД
```
id           | 2
firstName    | Алина
lastName     | Волкова
middleName   | Вячеславовна
email        | volkhova@mail.com
hashPassword | $2b$05$/n0Kt3Gf5DRJivXcYaq7tuwmuI9NKHDpVCw/3czm.Y5I7XSb5V.TS
phone        | 9999999999
description  | axyenny agent
photo        | AlinaVolkhovaVyacheslavovna.jpg
telegram     | telega soset tozhe potomu chto slivaet dannye
vk           | vk kontora pidorasov
isAdmin      | t
createdAt    | 2025-07-21 20:51:18.810451
updatedAt    | 2025-07-21 21:18:26.927641
```
##### Пример вывода `Agent type`
```json
{
  "id": 2,
  "firstName": "Алина",
  "lastName": "Волкова",
  "middleName": "Вячеславовна",
  "email": "volkhova@mail.com",
  "phone": "9999999999",
  "description": "axyenny agent",
  "photo": "AlinaVolkhovaVyacheslavovna.jpg",
  "telegram": "telegram",
  "vk": "vk",
  "isAdmin": true,
  "createdAt": "2025-07-21T17:51:18.810Z",
  "updatedAt": "2025-07-21T18:18:26.927Z"
}
```
##### Пример вывода `ShortAgent type`
```json
{
    "id": 2,
    "firstName": "Алина",
    "lastName": "Волкова",
    "photo": "AlinaVolkhovaVyacheslavovna.jpg"
}
```

#### POST
##### `/create` ++++++++++++++++
**body:**

| поле                    | тип                                      |
| ----------------------- | ---------------------------------------- |
| firstName               | `string`                                 |
| lastName                | `string`                                 |
| email                   | `string`                                 |
| password                | `string`                                 |
| phone                   | `string`                                 |
| photo                   | `File` (фото .jpeg, это аватарка агента) |
| **Необязательные поля** |                                          |
| middleName?             | `string`                                 |
| description             | `string`                                 |
| telegram                | `string`                                 |
| vk                      | `string`                                 |

**response:**
`Agent type`
##### `/login` ++++++++++++++++
**body:**

| поле     | тип      |
| -------- | -------- |
| email    | `string` |
| password | `string` |
**response:**
##### `/delete` ++++++++++++++++
**body:**

| поле | тип    |
| ---- | ------ |
| id   | number |
**response:**
status 200
```json
true
```

##### `/edit` ++++++++++++++++
**body:**

| поле                    | тип      |
| ----------------------- | -------- |
| id                      | `int`    |
| **Необязательные поля** |          |
| firstName?              | `string` |
| lastName?               | `string` |
| middleName?             | `string` |
| email?                  | `string` |
| phone?                  | `string` |
| description?            | `string` |
| telegram?               | `string` |
| vk?                     | `string` |
| isAdmin                 | `bool`   |

**response:**
`Agent type`
#### GET
##### `/auth` ++++++++++++++++
**headers.authorization:** 
должен содержать jwt токен.

**response:**
`jwt token`
##### `/:id` ++++++++++++++++
\---
**response:**
`Agent type`
##### `/` ++++++++++++++++
\---
**response:**
`ShortAgent type[]`
## -----------------------------------------

### Relevant: `/relevant`
взаимодействие с доп. таблицами
#### City: `/city`
```json
{ // City type
    "id": 1,
    "name": "Los-Angeles"
}
```
##### `/` ++++++++++++++++
\---
response:
`City type[]`
##### /:id ++++++++++++++++
\---
response:
`City type`

##### /create ++++++++++++++++
**body:**

| поле | тип      |
| ---- | -------- |
| name | `string` |
response:
`City type`
##### `/delete` ++++++++++++++++
**body:**

| поле | тип   |
| ---- | ----- |
| id   | `int` |
response:
`City type`

#### EyeColor: `/eye`
```json
{ // EyeColor type
    "id": 1,
    "name": "green"
}
```
##### `/` ++++++++++++++++
\---
response:
`EyeColor type[]`
##### /:id ++++++++++++++++
\---
response:
`EyeColor type`

##### /create ++++++++++++++++
**body:**

| поле | тип      |
| ---- | -------- |
| name | `string` |
response:
`EyeColor type`
##### `/delete` ++++++++++++++++
**body:**

| поле | тип   |
| ---- | ----- |
| id   | `int` |
response:
`EyeColor type`

#### Language: `/language`
```json
{ // City type
    "id": 1,
    "name": "english"
}
```
##### `/` ++++++++++++++++
\---
response:
`Language type[]`
##### /:id ++++++++++++++++
\---
response:
`Language type`

##### /create ++++++++++++++++
**body:**

| поле | тип      |
| ---- | -------- |
| name | `string` |
response:
`Language type`
##### `/delete` ++++++++++++++++
**body:**

| поле | тип   |
| ---- | ----- |
| id   | `int` |
response:
`Language type`