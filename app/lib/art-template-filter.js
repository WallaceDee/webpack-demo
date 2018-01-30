var runtime = require('art-template/lib/runtime');
import { gender_list } from 'config';

//  "gender_list":  [{ "name": "保密", "value": 0, "class": "unknow" }, { "name": "男", "value": 1, "class": "male" }, { "name": "女", "value": 2, "class": "female" }]
runtime.gender2class = function(value) {
    var name = gender_list[0].class;
    for (var i = 0; i < gender_list.length; i++) {
        if (value === gender_list[i].name) {
            name = gender_list[i].class;
        }
    }
    return name;
};


module.exports = runtime;