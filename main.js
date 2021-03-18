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
    var rev_queue = [...queue].sort((x,y) => y-x).reverse();
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


function divide_work (trips, K) {

    /*
    partition trip times array into M subarrays with (hopefully) equal sum
    if not possible, just get close.

    WORKS WITH PERFECT DATA

    HOW TO GET IT CLOSE?

    */
    var total_sum = sum(trips);
    var target = total_sum / K;
    //var pre_sum = prefix_sum(trips);
    var solution = [];
    var copy = [...trips];
    var i = 0;
    var count = 0;
    while (copy.length > 0 && count < 100) {
        var copy2 = [...copy];
        var group = [copy[0]];
        if (sum(group) == target) {
            solution.push(group);
            break;
        }
        copy.splice(0,1);
        var j = 0;
        //count++;
        while (j < copy.length && count < 10000) {
            console.log('trying j=' + j)
            console.log('copy='+copy)
            console.log('group='+group)
            count++;
            if (sum(group) == target) {
                solution.push(group);
                break;
            } else if (sum(group) + copy[j] == target) {
                console.log('found')
                group.push(copy[j]);
                console.log('copy='+copy)
                console.log('group='+group)
                solution.push(group);
                copy.splice(j,1);
                i = 0;
                break;
            } else if (sum(group) + copy[j] > target) {
                console.log('reset')
                console.log(copy)
                copy = [...copy2]
                group = [copy[0]];
                copy.splice(0,1);
                console.log(copy)
                j++;
                continue;
            } else if (sum(group) + copy[j] < target) {
                console.log('keep adding')
                group.push(copy[j]);
                copy.splice(j,1);
                console.log('copy='+copy)
                console.log('group='+group)
                //j++;
                continue;
            }
        }
    }
    if (solution.length < K) {
        console.log('no perfect solution...')

        // DO SOMETHING HERE
        // duplicates on len == odd 
        // adds too much to first bucket
        function round_robin (trips, K) {
            trips.sort((x,y) => x - y);
            var trips_rev = [...trips].reverse()
            var size = trips.length;
            var buckets = [...Array(K)].map(x => []);
            if (size % 2 == 0) {
                var mid = size / 2;
            } else {
                var mid = Math.ceil(size / 2)
            }

            for (let i=0; i < mid; i++) {
                console.log('adding ' + trips[i])
                buckets[i % K].push(trips[i])
                buckets[i % K].push(trips_rev[i])
            }

            return buckets

        }

        trips.sort((x,y) => x - y);
        var trips_rev = [...trips].reverse()
        var size = trips.length;
        var buckets = [...Array(K)].map(x => []);
        if (size % 2 == 0) {
            var mid = size / 2;
        } else {
            var mid = Math.ceil(size / 2)
        }

        for (let i=0; i < mid; i++) {
            console.log('adding ' + trips[i])
            buckets[i % K].push(trips[i])
            buckets[i % K].push(trips_rev[i])
        }


    }
    return solution;
}

function sum (array) {
    return array.reduce((a,v) => a + v)
}


function prefix_sum (array) {
    var result = array.reduce((a,c,i,o) => 
        (a.length > 0 ? 
            a.concat([sum(o.slice(0,i)) + c]) : 
            a.concat([c])), a=[]);

    return result;
}


function scratch () {

    var data = read_input_file('./test/input-files/input1.txt');
    // sorted!?
    var queue = preprocess_input_data(data);
    var map = floor_map(queue);
    var remainder = queue.length % Q;

    trips = incremental(queue.map(x => x[1])).map(x => time_trip(x));
    total = trips.reduce((a,v) => a + v);

    divide_work(trips)
    /*
    PRIORITY????

    group those going to same floor

    remainder (non-full car) goes to first floors

    assume it doesn't matter how quickly it is fulfilled to individual people? like if we save the bottom for the end they won't be pissed? i mean they should just take the stairs right?



    */



}