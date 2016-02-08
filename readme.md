# Reactive forum
This project aims to modernize forum interface using Reactjs && Material Design. The idea is to simplify forum browsing experiences with accessible navigation. Besides, sometimes we don't want to view particular comments in a forum thread, this design enables us to hide particular user comments on our favour :v: .  
Ultimately, the project will make it easy to integrated into existing systems such as Nodejs, Rails, Django, etc...     
For proof of concept, the project is built on top of Meteorjs. We are porting to nodejs with NPM support so you can integrate into your existing project.   
###[Working product](http://ditchcrab.com)

### Current stacks
* Reactjs
* Redux
* Meteorjs
* Webpack
* ES2015
* Material-ui

### Current file structures
```
/entry                    *Entry point Webpack to Meteor. See kickstart-hugeapp for  more information
/modules
  /forum
    /client                *Client side codes
      /__tests__/          *Includes unit and integration tests
      /components/         *React components
      /containters/        *Root react components
      /icons/              *svg icons
      /reducers/           *Redux reducers
      /store/              *Redux store configurations
      /actions/            *Redux create actions
      /constants/          *Redux constants
      /styles/             *Inline js styles
    /collections/          *Meteor collections
    /server/
    /methods.js           *Client & server shared code

```
 
# Interested in how it works, clone project and run

### Development mode 
    meteor
     
### Production mode
    meteor --production

### Build
    meteor build .

### Deploy with MUP
    mup deploy  

The project use cfs-filesystem for image upload, make sure you change production folder permission for that.

# Roadmap  
* Porting into nodejs
* Add admin panel
* Rich-text editor
* Support view mode (focus mode) for medium and large screen
* IOS & Android support with Reactnative
* Rails, Django, Wordpress, CMS support
* Music & Video stream