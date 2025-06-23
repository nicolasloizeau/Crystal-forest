import * as THREE from 'three';
import { ConvexGeometry } from 'three/addons/geometries/ConvexGeometry.js';

function inner(u,v){
  var k = 0;
  for(var i=0; i<3; i++){
    k+=u[i]*v[i];
  }
  return k;
}

function mul(k,u){
  var v = [0,0,0];
  for(var i=0; i<3; i++){
    v[i] = k*u[i];
  }
  return v;
}

function proj(u,v){
  var k = inner(u,v)/inner(u,u);
  return mul(k,u);
}

function diff(u,v){
  var w = [0,0,0];
  for(var i=0; i<3; i++){
    w[i] = u[i]-v[i];
  }
  return w;
}
function add(u,v){
  var w = [0,0,0];
  for(var i=0; i<3; i++){
    w[i] = u[i]+v[i];
  }
  return w;
}

function cross(u,v){
  return [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]];
}

function normalize(u){
  return mul(1/Math.sqrt(inner(u,u)), u);
}


export function center(points){
  var x = [];
  var y = [];
  var z = [];
  for(var i=0; i<points.length; i++){
    x.push(points[i][0]);
    y.push(points[i][1]);
    z.push(points[i][2]);
  }
  var x0 = (Math.max(...x)+Math.min(...x))/2;
  var y0 = (Math.max(...y)+Math.min(...y))/2;
  var z0 = (Math.max(...z)+Math.min(...z))/2;
  return [-x0,-y0,-z0];
}

export function parallel(u,v){
  if(inner(u,v)**2<inner(u,u)*inner(v,v)-1e-14){
    return false;
  }
  return true;
}

function polygon(p, v, n, d){
  var v2 = [1.254,2,0];
  var v3 = [0.1,0,0.424245];

  var u2 = diff(v2,proj(v,v2));
  var u3 = diff(diff(v3,proj(v,v3)),proj(u2,v3));
  u2 = normalize(u2);
  u3 = normalize(u3);
  var points = [];
  for(var i=0; i<n; i++){
    var theta = 2*Math.PI*i/n;
    var pi = add(mul(d*Math.cos(theta), u2), mul(d*Math.sin(theta), u3));
    var pi = add(pi, p);
    points.push(pi);
  }
  return points;
}

function polygon_triangles(points){
  var triangles = []
  for(var i=0; i<points.length-2; i++){
    triangles.push(...points[0]);
    triangles.push(...points[i+1]);
    triangles.push(...points[i+2]);
  }
  return triangles;
}

export function polygons(network, n, d1, d2){
  var nodes = network[0];
  var edges = network[1];
  var polygons = []
  for(var i=0; i<edges.length; i++){
    var p1 = nodes[edges[i][0]];
    var p2 = nodes[edges[i][1]];
    var u = normalize(diff(p1,p2));
    var p1b = diff(p1, mul(d2,u));
    var p2b = add(p2, mul(d2,u));
    var polys = [polygon(p1b, u, n, d1), polygon(p2b, u, n, d1)];
    polygons.push(polys);
  }
  return polygons;
}


function spin(poly1, poly2){
    var u = diff(poly1[0],poly2[0]);
    var v = diff(poly1[0],poly1[1]);
    var w = diff(poly1[1],poly1[2]);
    return inner(u,cross(v,w));
}

function tube(polys){
  var triangles = [];
  var poly1 = polys[0];
  var poly2 = polys[1];
  var n = poly1.length;
  if (spin(poly1, poly2)<0){
    for(var i=0; i<n; i++){
      triangles.push(...poly2[(i+1)%n]);
      triangles.push(...poly2[i]);
      triangles.push(...poly1[i]);
      triangles.push(...poly1[(i+1)%n]);
      triangles.push(...poly2[(i+1)%n]);
      triangles.push(...poly1[i]);
    }
  }else{
    for(var i=0; i<n; i++){
      triangles.push(...poly2[(i+1)%n]);
      triangles.push(...poly1[i]);
      triangles.push(...poly2[i]);
      triangles.push(...poly1[(i+1)%n]);
      triangles.push(...poly1[i]);
      triangles.push(...poly2[(i+1)%n]);
    }
  }

  return triangles;
}

export function tubes(polys){
  var triangles = [];
  for(var i=0; i<polys.length; i++){
    triangles.push(...tube(polys[i]));
  }
  return triangles;
}

export function get_edge_indices(nodes, edges) {
  // returns a list of edges index associated to each node
  var edge_indices = [];
  for(var i=0; i<nodes.length; i++){
    edge_indices[i] = [];
  }
  for(var i=0; i<edges.length; i++){
    edge_indices[edges[i][0]].push(i);
    edge_indices[edges[i][1]].push(i);
  }
  return edge_indices;
}

export function hull_points(node, network, edge_indices, polys){
  var points = [];
  for(var i=0; i<edge_indices[node].length; i++ ){
    var edgei = edge_indices[node][i];
    var edge = network[1][edgei];
    if(edge[0]==node){
      var ps = polys[edgei][0];
    }else{
      var ps = polys[edgei][1];
    }
    for(var j=0; j<ps.length; j++){
      points.push(new THREE.Vector3(...ps[j]));
    }
  }
  return points;
}


function normals(points, n){
  var vs =[];
  for(var i=0; i<points.length/n; i++){
    var p1 = [points[0+i*n].x, points[0+i*n].y, points[0+i*n].z];
    var p2 = [points[1+i*n].x, points[1+i*n].y, points[1+i*n].z];
    var p3 = [points[2+i*n].x, points[2+i*n].y, points[2+i*n].z];
    var u = cross(diff(p1,p2),diff(p1,p3));
    vs.push(u);
  }
  return vs;
}

function clean_hull(points, triangles, n){
  var triangles2 = [];
  var us = normals(points, n);
  for(var i=0; i<triangles.length/9; i++){
    var p1 = triangles.slice(i*9,i*9+3);
    var p2 = triangles.slice(i*9+3,i*9+6);
    var p3 = triangles.slice(i*9+6,i*9+9);
    var v = cross(diff(p1,p2),diff(p1,p3));
    var allowed = true;
    for(var j=0; j<us.length; j++){
      if(parallel(us[j],v)){
        allowed = false;
      }
    }
    if(allowed){
      triangles2.push(...p3);
      triangles2.push(...p1);
      triangles2.push(...p2);
    }
  }
  return triangles2;
}

export function hull_triangles(node, net, edge_indices, polys) {
  var n = polys[0][0].length;
  var points = hull_points(node, net, edge_indices, polys);
  const geometry = new ConvexGeometry( points );
  var triangles = geometry.attributes.position.array;
  return clean_hull(points, triangles, n);
}

function end_triangles(node, net, edge_indices, polys){
  var edgei = edge_indices[node][0];
  var edge = net[1][edgei];
  if(edge[0]==node){
    var ps = polys[edgei][0];
  }else{
    var ps = polys[edgei][1];
  }
  return polygon_triangles(ps);
}

export function inflate(net, n, d1, d2){
  var polys = polygons(net, n, d1, d2);
  var triangles = tubes(polys);
  var edge_indices = get_edge_indices(net[0], net[1]);
  for(var node=0; node<net[0].length; node++){
    if(edge_indices[node].length>1){
      triangles.push(...hull_triangles(node, net, edge_indices, polys));
    }
    if(edge_indices[node].length==1){
      triangles.push(...end_triangles(node, net, edge_indices, polys));
    }
  }
  return new Float32Array(triangles);
}
