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

    // filter out requests > M ??

    var raw_queue = data.split('\n').slice(-1)[0];
    //var queue = raw_queue.split(',').map(x => eval(x))
    // keep ticket number??
    var queue = raw_queue.split(',').map((x,i) => [i,eval(x)]);
    //if (sort) {queue.sort((x,y) => x - y)};

    return queue

}


function floor_map (queue) {
    /*
    takes in array
    returns object with unique keys and count of each key in original array
    */
    var map = {};
/*    queue.forEach(function(item) {
        if (map.hasOwnProperty(item)) {
            map[item] += 1
        } else {
            map[item] = 1
        }
    });
    */

    queue.forEach(function(item) {
        if (map.hasOwnProperty(item[1])) {
            map[item[1]].push(item[0])
        } else {
            map[item[1]] = [item[0]]
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

    // NEED TO THREAD BY NUMBER OF ELEVATORS HERE TO SAVE TIME??
    // maybe just call this M times and then the longest overall elevator time is the total? Since the overlap is running in parallel?

    var total_time = 0;
    plan.forEach(function(trip) {
        total_time += time_trip(trip);
    })
    return total_time

}


function incremental (queue) {
    /*
    simple plan, goes up in reverse order of sorted queue
    1500~ s for test1
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


function divide_work (trips) {

    /*
    partition trip times array into M subarrays with (hopefully) equal sum
    if not possible, just get close.
    */
    sum = trips.reduce((a,v) => a + v);

    if (sum % M == 0) {console.log('good split')}
    
    while 

}

function sum (array) {
    return array.reduce((a,v) => a + v)
}


function split_to_equal_subarrays (array, K) {

    /*
    takes in an array and a K to group into
    splits array into K groups of equal sum
    returns nested array of groups
    */

    //array = [1,2,3,4,5]
    //K = 3


    // find a way to do this without sorting???
    array.sort((x,y) => x - y)

    var total = sum(array);

/*    if !(total % K == 0) {
        console.log('no perfect split');
        return -1;
    }*/

    //array_copy = [...array]

    var taken = [...array].map(x => false);
    var target = total / K;
    var i = 0;
    var solution = [];

    for (i; i < array.length; i++) {
        group = [array[i]];
        if (sum(group) == target) {
            console.log('single solution, pushing ' + array[i])
            solution.push(group);
            continue;
        }
        var j = i + 1;
        for (j; j < array.length; j++) {
            subtotal = sum(group) + array[j];
            if (subtotal == target) {
                group.push(array[j]);
                console.log('compound solution, pushing ' + group)
                solution.push(group);
                //group.map(x => solution[x] = true);
                break;
            } else if (subtotal > target) {
                group = [array[i]];
                continue;
            } else if (subtotal < target) {
                group.push(array[j]);
            }
        }
    }

    return solution;

}



function scratch () {

    var data = read_input_file('./test/input-files/input1.txt');
    // sorted!?
    var queue = preprocess_input_data(data);
    var map = floor_map(queue);
    var remainder = queue.length % Q;

    trips = incremental(queue).map(x => time_trip(x));
    total = trips.reduce((a,v) => a + v);

    /*
    PRIORITY????

    group those going to same floor

    remainder (non-full car) goes to first floors

    assume it doesn't matter how quickly it is fulfilled to individual people? like if we save the bottom for the end they won't be pissed? i mean they should just take the stairs right?



    */



}