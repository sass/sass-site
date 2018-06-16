```scss
@mixin transform($property) {
  -webkit-transform: $property;
      -ms-transform: $property;
          transform: $property;
}

.box { @include transform(rotate(30deg)); }
```
