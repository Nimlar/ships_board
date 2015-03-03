qr.canvas({
        canvas: document.getElementById('new-player'),
        size : 10,
        value: 'http://toromanoff.org/gameid/new_player'
      });
var Width = document.getElementById('svg').offsetWidth;
var Height = document.getElementById('svg').offsetHeight;

function ship_move()
{
    //console.log(JSON.stringify(this), ["img"], 4);
    var x0=this.prev[0]*Width;
    var y0=this.prev[1]*Height;
    var x1=this.pos[0]*Width;
    var y1=this.pos[1]*Height;

    var t=new Snap.Matrix();
    t.translate(x1, y1);
    t.rotate(this.angle,0,0);
    this.img.animate({transform :t}, this.time, mina.linear);
}
function ship_gain(val){

    var sText = s.text(0, 0, val).attr({ fontSize: '100px', "text-anchor": "middle", "fill": this.color });

    /* create the path to follow while animation */
    var p1x,p1y,cx,cy,p2x,p2y;
    var dx, dy;
    p1x=this.planet.pos[0]*Width;
    p1y=this.planet.pos[1]*Height;
    var bbox=this.img.getBBox();
    p2x=bbox.cx;
    p2y=bbox.cy;

    /* normal calculation : http://stackoverflow.com/questions/1243614/how-do-i-calculate-the-normal-vector-of-a-line-segment */
    dx=p2x-p1x;
    dy=p2y-p1y;
    /* normal vectors are (dy, -dx) and  (-dy, dx) */
    /* we want the one that go up, so with an y component <=0 */
    if(dx>=0) {
        dx=-dx;
    } else {
        dy=-dy;
    }
    /* the normal vector is the same size as p1 to p2, we want it 2 times bigger so*/
    cx=p1x+dx/2+ dy* 2
    cy=p1y+dy/2+ dx* 2

//    var t=s.path("M"+p1x+","+p1y +" Q"+ cx +","+ cy +","+ p2x +","+p2y)
//    s.append(t);
    pathStr="M"+this.planet.pos[0]*Width+"," + this.planet.pos[1]*Height+"q10,10,10,10"
    var timing = 800;
    Snap.animate( 0, 2, function( value ) {
        var dot = Snap.path.findDotsAtSegment(p1x,p1y,cx,cy,cx,cy,p2x,p2y,value/2);
        sText.transform('t'+ dot.x +',' + dot.y );
        if (value <1) {
            sText.attr({ 'font-size': value * 10 +10 });      // Animate by font-size
        } else {
            sText.attr({ 'font-size': (2-value) * 10 +10});      // Animate by font-size
        }
    }, timing, mina.elactic, function() { sText.remove() } );

}
function ship_lost(val){


    /* create the path to follow while animation */
    var bbox=this.img.getBBox();
    p1x=bbox.cx;
    p1y=bbox.cy;

    var sText = s.text(p1x, p1y+20, val).attr({ fontSize: '20px', "text-anchor": "middle", "fill": this.color });
    var timing = 800;
    Snap.animate( 0, 1, function( value ) {
        sText.transform('t0,'+ value*20 );
        sText.attr({ 'opacity': 1-value });      // Animate by font-size
    }, timing, mina.easeout, function() { sText.remove() } );

}

var s = Snap("#svg");
_ships=[{ pos : [0  ,0    ],     prev :[.2  ,.3  ], color: "red", move:ship_move, gain:ship_gain, lost:ship_lost},
        { pos : [.5  ,.5  ],     prev :[.2  ,.3  ], color: "yellow", move:ship_move, gain:ship_gain, lost:ship_lost},
        { pos : [.4  ,.5  ],     prev :[.2  ,.3  ], color: "green", move:ship_move, gain:ship_gain, lost:ship_lost},
        { pos : [.001,0.83],     prev :[.2  ,.3  ], color: "blue", move:ship_move, gain:ship_gain, lost:ship_lost},
        { pos : [.03 ,.83 ],     prev :[.2  ,.3  ], color: "gray", move:ship_move, gain:ship_gain, lost:ship_lost}
       ];
//ships=_ships;
      ships=[_ships[0]];
//      ships=[_ships[0],_ships[1]];

planets=[{ pos : [.1  ,.3  ], size:10},
         { pos : [.3  ,.1  ], size:10},
         { pos : [.9  ,.7  ], size:10},
         { pos : [.7  ,.9  ], size:10},
         { pos : [.5  ,.5  ], size:10},
         { pos : [.78  ,.86  ], size:10},
         { pos : [.14  ,.23  ], size:10},
         { pos : [.36  ,.48  ], size:10},
         ];

for(i=0;i<planets.length;i++){
    planets[i].img=s.circle(planets[i].pos[0]*Width, planets[i].pos[1]*Height, planets[i].size*(Math.random()+.5));
    planets[i].img.attr({
        fill: "#bada55",
        stroke: "#000",
        strokeWidth: i
    });
}


function move_ship(ship)
{
    if (ship.img === undefined) {
        Snap.load("fleche.svg", function(e) {
            var f=e.select("g"); /* get the internal data of svg */
            f.select("#center").attr({fill: this.color});
            s.append(f);
            this.img=f;
            this.move();
        }, ship);
    } else {
        ship.move()
    }
}


function ship_to_planet(ship, planet)
{
    ship.prev[0]=ship.pos[0];
    ship.prev[1]=ship.pos[1];
    ship.planet=planet;

    ship.angle=Snap.angle(planet.pos[0]*Width, planet.pos[1]*Height, ship.prev[0]*Width, ship.prev[1]*Height);
    var angle=Snap.rad(ship.angle);
    ship.pos[0]=planet.pos[0]-planet.size*Math.cos(angle)/Width;
    ship.pos[1]=planet.pos[1]-planet.size*Math.sin(angle)/Height;
    ship.time = 1000;
//    cb=(function(){ return function() { rotate_ship(ship, cb) }; })();
    move_ship(ship);
}

function rotate_ship(ship)
{
    ship.angle+=10;
    var angle=Snap.rad(ship.angle);
    ship.pos[0]=ship.planet.pos[0]-ship.planet.size*Math.cos(angle)/Width;
    ship.pos[1]=ship.planet.pos[1]-ship.planet.size*Math.sin(angle)/Height;
    ship.time=100+Math.floor(Math.random() *100);
    move_ship(ship);
}

function move_all(){
    for(i=0;i<ships.length;i++){
        var dest = planets[Math.floor((Math.random() * planets.length))];
        ship_to_planet(ships[i], dest);
    }
}

function gain_all(){
    for(i=0;i<ships.length;i++){
        ships[i].gain(Math.floor((Math.random() * 2000)));
    }
}
function lost_all(){
    for(i=0;i<ships.length;i++){
        ships[i].lost(Math.floor((Math.random() * 1000)));
    }
}



//event_one();
