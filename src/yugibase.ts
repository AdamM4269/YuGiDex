fetch('http://localhost:4000/card/102380')
  .then(res => res.json())
  .then(data => console.log(data));

