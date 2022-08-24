# MessageBird WhatsApp Campaign Builder

## Introduction
HSM API is a Campaign Builder for WhatsApp. We are using MessageBird API to start broadcasting the messages.

In here, you will get 3 endpoints. 1 for text, 1 for image, and the other one for video template broadcast.

Postman Links [here](https://www.getpostman.com/collections/092c072ebe3c202b3d0a)

___

## Setup Guide
To start the project you will need to install NodeJs. This project is created with NodeJs v14.18.1. Download [here](https://nodejs.org/download/release/v14.18.2/)

After installing NodeJs, please restart your computer before proceeding to the next step.


Clone this repository to your local pc

```bash
git clone https://github.com/jakartabird/mb-whatsapp-campaign-builder.git
```

Install all of the dependencies
```bash
npm install
```

Then, after installing the dependencies, you can start the project by typing
```bash
npm start
```

---

## Configurator



### fieldNames content

> You need to configure this based on your total variables. Please just change the field name exactly as the csv header name for the variables itself. You can ignore the other key.

```json
...
    {
      "id":1,
      "label":"variable1",
      "value":"variable1",
      "fieldName":"first_name"
   }

```

Full sample of fieldNames

```json
[
   {
      "id":1,
      "label":"variable1",
      "value":"variable1",
      "fieldName":null
   },
   {
      "id":2,
      "label":"variable2",
      "value":"variable2",
      "fieldName":null
   },
   {
      "id":3,
      "label":"variable3",
      "value":"variable3",
      "fieldName":null
   },
   {
      "id":4,
      "label":"variable4",
      "value":"variable4",
      "fieldName":null
   },
   {
      "id":5,
      "label":"variable5",
      "value":"variable5",
      "fieldName":null
   },
   {
      "id":6,
      "label":"variable6",
      "value":"variable6",
      "fieldName":null
   },
   {
      "id":7,
      "label":"variable7",
      "value":"variable7",
      "fieldName":null
   },
   {
      "id":8,
      "label":"variable8",
      "value":"variable8",
      "fieldName":null
   },
   {
      "id":9,
      "label":"variable9",
      "value":"variable9",
      "fieldName":null
   },
   {
      "id":10,
      "label":"variable10",
      "value":"variable10",
      "fieldName":null
   },
   {
      "id":11,
      "label":"variable11",
      "value":"variable11",
      "fieldName":null
   },
   {
      "id":12,
      "label":"variable12",
      "value":"variable12",
      "fieldName":null
   },
   {
      "id":13,
      "label":"variable13",
      "value":"variable13",
      "fieldName":null
   },
   {
      "id":14,
      "label":"variable14",
      "value":"variable14",
      "fieldName":null
   },
   {
      "id":15,
      "label":"variable15",
      "value":"variable15",
      "fieldName":null
   }
]
```
