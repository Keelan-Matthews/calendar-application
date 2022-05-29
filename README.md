<div id="top"></div>

<div align="center">
  <h3 align="center">IMY 210 Vue Project 2022</h3>

  <p align="center">
      This repository contains a final Vue project that had to be completed for one of my second year modules. We were tasked with creating a fully-fledged scheduling application, utilizing all of the skills that we were taught throughout the semester. The specification required 5 preset users, each with their own schedule.
    </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
<a href="#built-with">Built With</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

### Built With

* [Vue.js](https://vuejs.org/)
* [Vuetify.js](https://vuetifyjs.com/en/)
* [XML](https://www.w3schools.com/xml/xml_whatis.asp)
* [XSLT](https://www.w3schools.com/xml/xsl_intro.asp)
* [Express](https://expressjs.com/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Install NPM packages (Do this in both the RESTful directory, as well as the Vue directory)
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

On startup, no calendar or user will be selectetd. You will need to select a calendar to display it, as well as the user of that calendar if you wish to edit it. You may however view any calendar you wish - you just will not be able to edit it if you are not signed in as the user.

Clicking on an event will display a summary of all its information, as well as an option to delete or edit the description of the event (I felt the description edit was more than enough to show the Update functionality of my server - more complex fetch requests are showcased in the Create request).

There is also an add event in the top right, keep in mind the starred fields are compulsory - this includes the starting and ending time despite the XML database requirements.

Lastly, you can change the view of the calendar from month to week to day etc. Also, the XML database specification did not supply a year field in the date section, so all repeating events end in 2022 and all events are automatically made in 2022.

Happy marking :)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Keelan Matthews - u21549967@tuks.co.za <br>
Student Number - u21549967

<p align="right">(<a href="#top">back to top</a>)</p>
