```sass
=transform($method)
  -webkit-transform: $method
  -ms-transform:     $method
  transform:         $method

.box
  +transform(rotate(30deg))
```
