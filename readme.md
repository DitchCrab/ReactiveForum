# Reactive open forum
This project aims to modernize forum interface using Reactjs && Material Design. The idea is to simplify forum browsing experiences with accessible navigation. Besides, sometimes we don't want to view particular comments in a forum thread, this design enables us to hide particular user comments on our favour :v: .  
Ultimately, the project should support Wordpress and I believe it is the right direction. As self-taught developer, I know how hard it is to materialise some ideas for none-technical people. Hence, I think this project can provide blueprint for people to make something themselves. In addition, the front-end should also be compatible with other framework with API and socket support. Check road map for framework support in the future.  
For [proof of concept](http://188.166.213.121), it is built on top of Meteorjs. The service still lacks many forum features, if you are interested, please give me a hand to make it awesome.

### Current stacks
* Reactjs
* Redux
* Meteorjs
* Webpack
* ES2015
* Material-ui

### File structures  
```
/entry                    *Entry point Webpack to Meteor. See kickstart-hugeapp for  more information
/modules
  /forum
    /client               *Client side codes
      /__tests__          *Includes unit and integration tests
      /components         *React components
      /containters        *Root react components
      /icons              *svg icons
      /reducers           *Redux reducers
      /store              *Redux store configurations
      /actions            *Redux create actions
      /constants          *Redux constants
      /styles             *Inline js styles
    /collections          *Meteor collections
    /server
    /methods.js           *Client & server shared code

```
 
### Development mode 
    meteor
     
### Production mode
    meteor --production

### Build
    meteor build .

### Deploy with MUP
    mup deploy

# Roadmap  
* Support nodejs
* Add admin panel
* Improve text editor
* Add push notifications
* Support view mode (focus mode) for medium and large screen
* Interconnect forum to the other to improve user experience
* IOS & Android support with Reactnative
* Rails 5, Play, Flask, Phoenix API and socket support
* Music & Video stream

# Credits  
Special credits to [thereactivestack](https://github.com/thereactivestack/kickstart-hugeapp). I would have hard time developing this service without your awesome setup.