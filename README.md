# Open Map Visualization

## App Specifications

### Inputs specifications

- A file containing a list of people, dates, and locations
  - The file must be human readable and written in JSON or XML
  - The location should be stored using coordinates not names
  - The input file should be imported form the client’s machine using an import button
- A slider on the bottom for representing a timeline
  - The slider should show the minimum and maximum dates on the left and right respectively
  - Minimum date and maximum date should be programmable
- A start/stop button for starting and stopping the animation
- A reset button for resetting the animation
- A path on/off button
  - This button turn on and the visibility of the tracks

### Outputs specifications

- A map tracking different people’s times and locations
  - The map should support both satellites and road maps
  - The satellite or Road map should be from open street maps or other free map APIs
- Pins in different colors representing different people
  - People should be animated using different colored pins
  - A pin should move tracking the time and place of its person
- Paths tracking the different colored pins
  - The paths’ visibility should be controlled by the path on/off button

### Platform specifications

- The web app should run client side only, expect for the maps APIs
- The web app should only needs to run on only Chromium and safari based browsers

Notes:
Available custom icon color provided from [source](https://github.com/pointhi/leaflet-color-markers) as below

- `black`
- `blue`
- `gold`
- `green`
- `grey`
- `orange`
- `red`
- `violet`
- `yellow`
