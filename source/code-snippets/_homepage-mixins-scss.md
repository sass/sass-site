```scss
@mixin transform($method) {
  -webkit-transform: $method;
      -ms-transform: $method;
          transform: $method;
}

.box { @include transform(rotate(30deg); }
```
