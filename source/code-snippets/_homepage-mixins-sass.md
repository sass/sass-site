```sass
=transform($property)
  -webkit-transform: $property
  -ms-transform:     $property
  transform:         $property

.box
  +transform(rotate(30deg))
```
