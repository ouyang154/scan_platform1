/**
* ROS接口
* Date: 2021/3/22
* Time: 2:39 下午
*/

import '@/assets/js/roslib.js'
var log_flag = true

var ros = new ROSLIB.Ros();
ros.on('error', function(error) {
    console.log(error);
});

// Find out exactly when we made a connection.
ros.on('connection', function() {
    console.log('Connection made!');
});

ros.on('close', function() {
    console.log('Connection closed.');
});

export function ROS_connect() {
    ros.connect('ws://localhost:9090');
}

export function ROS_service_get(parameter, callback) {
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        names: parameter.names
    });

    service.callService(request, function(result) {        
        callback(result)
    });    
}

export function ROS_service_set(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        parameters: parameter.parameters
    });

    service.callService(request, function(result) {        
        callback(result)
    });    
}

export function ROS_service_move(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        type: parameter.type,
        axis: parameter.axis,
        value: parameter.value
    });

    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_reset_axis(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        type: parameter.type,
        axis: parameter.axis,
        value: parameter.value
    });

    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_get_axis(parameter, callback) {
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        type: parameter.type,
        axis: parameter.axis,
        param: parameter.param,
        value: 0
    });

    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_set_485_current_pos(parameter, callback) {
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        type: parameter.type,
        axis: parameter.axis,
        param: parameter.param,
        value: parameter.value
    });

    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_get_io(parameter, callback) {
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    var request = new ROSLIB.ServiceRequest({
        io_begin: 0,
        io_end: parameter.io_end,
        mask: ''
    });
    service.callService(request, function(result) {   
        callback(result)
    });    
}

export function ROS_service_set_io(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        io: parameter.io,
        tf: parameter.tf
    });
    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_set_multi_io(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        io_begin: parameter.io_begin,
        io_end: parameter.io_end,
        mask: parameter.mask
    });
    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_update_para(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest();
    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_list_para(parameter, callback) {
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    
    var request = new ROSLIB.ServiceRequest({
        prefixes: parameter.prefixes,
        depth: parameter.depth
    });
    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_service_unit_test(parameter, callback) {
    if (log_flag){console.log(parameter)}
    var service = new ROSLIB.Service({
        ros : ros,
        name : parameter.name,
        serviceType : parameter.serviceType
    });
    var request = new ROSLIB.ServiceRequest(parameter.obj); 
    service.callService(request, function(result) {    
        callback(result)
    });    
}

export function ROS_topic_unit_test(parameter) {
    if (log_flag){console.log(parameter)}
    var topic = new ROSLIB.Topic({
        ros : ros,
        name : parameter.name,
        messageType : parameter.messageType
    });   
    topic.publish(parameter.obj);
}


export function ROS_topic_move(parameter) {
    if (log_flag){console.log(parameter)}
    var topic = new ROSLIB.Topic({
        ros : ros,
        name : parameter.name,
        messageType : parameter.messageType
    });    
    topic.publish({
        type: parameter.type,
        axis: parameter.axis,
        value: parameter.value,
        param: ''
    });
}

export function ROS_topic(parameter) {
    if (log_flag){console.log(parameter)}
    var topic = new ROSLIB.Topic({
        ros : ros,
        name : parameter.name,
        messageType : parameter.messageType
    });      
    topic.publish(parameter.obj);
}

export function ROS_topic_sub(parameter,callback) {
    if (log_flag){console.log(parameter)}
    var topic = new ROSLIB.Topic({
        ros : ros,
        name : parameter.name,
        messageType : parameter.messageType
    });      
    topic.subscribe(function(message){
        callback(message)
    });
}
