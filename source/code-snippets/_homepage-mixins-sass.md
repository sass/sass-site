```sass
=transform($method)
  -webkit-transform: $method
  -moz-transform:    $method
  -ms-transform:     $method
  transform:         $method

.box
  +transform(rotate(30deg))
```
