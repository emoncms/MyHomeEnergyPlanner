  function subtract(A, B)
  {
    return {x: B.x - A.x, y: B.y - A.y};
  }

  function unitvector(A)
  {
    var mod = Math.sqrt((A.x * A.x) + (A.y * A.y));
    return {x: A.x/mod, y: A.y/mod};
  }

  function scale(A, scale)
  {
    return {x: A.x * scale, y: A.y * scale};
  }
