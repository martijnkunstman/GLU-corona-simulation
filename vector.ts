class Vector
{
    public x: number;
    public y: number;
    constructor(x : number,y: number)
    {
      this.x = x;
      this.y = y;
    }
    //-----------------------------
    add(vector:Vector){
      this.x += vector.x;
      this.y += vector.y;
      return this;
    }
    substract(vector:Vector){
      this.x -= vector.x;
      this.y -= vector.y;
      return this;
    }
    multiply(vector:Vector){
      this.x *= vector.x;
      this.y *= vector.y;
      return this;
    }
    divide(vector:Vector){
      this.x /= vector.x;
      this.y /= vector.y;
      return this;
    }
    //-----------------------------
    distance(vector:Vector){
        return Math.sqrt( Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
    limit(){

    }
    normalize(number:Number = 1)
    {

    }
}