<?xml version="1.0" encoding="utf-8"?>
<!-- Keelan Matthews u21549967 -->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <html>
            <head></head>
            <style>
                * {
                    font-family: "Roboto", "Helvetica", sans-serif;
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                h1 {
                    color: #2dc28e;
                    height: 50px;
                    font-size: 45px;
                    margin: 30px;
                }

                h2 {
                    font-size: 30px;
                    margin-bottom: 50px;
                }

                body {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .events {
                    display: flex;
                    flex-wrap: wrap;
                    width: 1300px;
                }

                .event {
                    width: 400px;
                    height: 500px;
                    border-radius: 6px;
                    background-color: #F5F5F5;
                    margin: 10px;
                }

                .event-header {
                    background-color: #2dc28e;
                    width: 100%;
                    padding: 25px;
                    color: white;
                    border-radius: 6px 6px 0 0;
                    box-shadow: -1px 12px 34px -14px rgba(0,0,0,0.58);
                    margin-bottom: 10px;
                }

                h3 {
                    font-size: 20px;
                }

                .content  {
                    color: #636363;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 83%;
                }

                .content span {
                    font-size: 12px;
                    font-weight: normal;
                    background-color: #2dc28e;
                    padding: 6px;
                    border-radius: 4px;
                    color: white;
                    margin-left: 10px;
                }

                .date {
                    margin-top: 10px;
                }

                .time {
                    font-weight: bold;
                    margin-bottom: 20px;
                }

                .description {
                    height: 100px;
                    width: 100%;
                }

                .guests {
                    border-left: 3px solid #2dc28e;
                    margin-bottom: 20px;
                }

                h4 {
                    margin-bottom: 15px;
                }

                .guests p {
                    margin-top: 5px;
                    margin-left: 10px;
                }

                .name {
                    font-weight: bold;
                }

                .repeat {
                    text-align: right;
                    font-weight: bold;
                }
            </style>

            <body>
                <h1><xsl:value-of select="schedule/@user"/>'s schedule</h1>
                <h2>Upcoming Events</h2>
                <div class="events">
                    <xsl:apply-templates select="schedule/event"/>
                </div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="event">
        <div class="event">
            <div class="event-header">
                <h3><xsl:value-of select="title"/> (<xsl:value-of select="venue"/>)</h3>
            </div>
            <div class="content">
                <div>
                    <div style="display: flex; margin-bottom: 20px;">
                        <h3><xsl:value-of select="type"/></h3>
                        <span><xsl:value-of select="date/day"/>&#160;<xsl:value-of select="date/month"/> 2022</span>
                    </div>
                    
                    <p class="time"><xsl:value-of select="date/startingTime"/> - <xsl:value-of select="date/endingTime"/></p>
                    <p class="description"><xsl:value-of select="description"/></p>
                    <h4>Guests</h4>
                    <xsl:for-each select="guests/guest">
                        <xsl:if test="not(position() > 2)">
                            <div class="guests">
                                <p class="name"><xsl:value-of select="name"/></p>
                                <p><xsl:value-of select="email"/></p>
                            </div>
                        </xsl:if>
                    </xsl:for-each>
                </div>
                <xsl:if test="date/@repeat">
                    <p class="repeat">&#11119; <xsl:value-of select="date/@repeat"/></p>
                </xsl:if>
            </div>
        </div>
    </xsl:template>

</xsl:stylesheet>      