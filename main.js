#!/usr/bin/env node
/* 
main.js
date: 03/16/2020
author: Jack Skrable
description: 
*/

// package requirements
// file system package
const fs = require('fs');


// for dev
const N = 100
const M = 3
const Q = 8


function read_input_file (filepath) {
    // try to read the file
    try {
        var raw = fs.readFileSync(filepath, 'utf8');
        return raw
    } catch(e) {
        console.log('\nThere was an issue reading the file')
        return -1
    }
}


function preprocess_input_data (data, sort=false) {
    // extract elevator queue
    // trim bad data
    // validate against other parameters

    var raw_queue = data.split('\n').slice(-1)[0];
    var queue = raw_queue.split(',').map(x => eval(x))

    // filter out requests > M ??

    // keep ticket number??
    //data.split('\n').slice(-1)[0].split(',').map((x,i) => [i,x])

    if (sort) {queue.sort((x,y) => x - y)};

    return queue

}


function floor_map (queue) {
    /*
    takes in array
    returns object with unique keys and count of each key in original array
    */
    var map = {};
    queue.forEach(function(item) {
        if (map.hasOwnProperty(item)) {
            map[item] += 1
        } else {
            map[item] = 1
        }
    });
    return map;
}

function unique_array (list) {
    /*
    takes in array
    returns unique array
    */
    return list.filter((a,c,v) => v.indexOf(a) == c)
}


function time_trip (dest) {
    /*
    takes in list of destination floors
    returns total trip time in seconds

    assumptions: passengers embark/disembark with no time penalty

    */
    var floors = unique_array(dest);
    var top = floors.slice(-1)[0];
    var time = top * 2 + top;
    return time


}


function execute_trip (plan) {
    /*
    takes in array of with groups of trips
    executes trips
    times trips
    returns total time
    */

    var total_time = 0;
    plan.forEach(function(trip) {
        total_time += time_trip(trip);
    })
    return total_time

}


function incremental (queue) {
    /*
    simple plan, goes up in reverse order of sorted queue
    */
    var plan = [];
    var i = 0;
    var rev_queue = [...queue].reverse();
    while (i < rev_queue.length) {
        plan.push(rev_queue.slice(i, Q + i))
        i += Q
    };

    return plan;
}



function write_results (plan, time) {
    /*
    how best to display this??
    trip groups
        passenger number in queue?
        destination floor?
    time per trip
    total time at bottom
    */
    return 0
}




function main () {

    var data = read_input_file();
    // sorted!?
    var queue = preprocess_input_data(data);
    var map = floor_map(queue);
    var remainder = queue.length % Q;


    /*
    PRIORITY????

    group those going to same floor

    remainder (non-full car) goes to first floors

    assume it doesn't matter how quickly it is fulfilled to individual people? like if we save the bottom for the end they won't be pissed? i mean they should just take the stairs right?



    */



}