// Meta helper for social media
export default function(path, description, img) {
  const domain = 'http://mydomain.com';
  const url = domain + path;
  return [
    {name: 'description', content: description},
    {name: 'keywords', content: 'crab, user'},
    {charset: 'UFT-8'},
    //Open graph
    {property: 'og:title', content: 'Forum'},
    {property: 'og:type', content: 'lists'},
    {property: 'og:url', content: url},
    {property: 'og:image', content: img},
    {property: 'og:description', content: description},
    {property: 'og:site_name', content: 'My website'},
    //Twitter
    {name: 'twitter:card', content: img},
    {name: 'twitter:site', content: url},
    {name: 'twitter:title', content: 'Forum'},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image:src', content: img},
    // Google plus
    {itemprop: 'name', content: 'Forum'},
    {itemprop: 'description', content: description},
    {itemprop: 'image', content: img}
  ]
}
