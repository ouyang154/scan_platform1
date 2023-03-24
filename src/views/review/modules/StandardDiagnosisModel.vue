/**
*
* Date: 2020/6/5
* Time: 11:08 下午
*/
<template>
    <div class="department-form-model">
        <!-- S 表单 -->
        <a-form-model ref="ruleForm" :label-col="labelCol" :wrapper-col="wrapperCol" class="report-diagnose__form">
            <a-row :gutter="16">
                <a-col v-if="checkbox_tree_data" :span="24" :style="{ width: '100%', overflow: 'scroll' }">
                    <el-collapse v-model="activeName" accordion>
                        <!-- <template v-for="(value, key) in checkbox_tree_data">
                            <h1>{{ value.displayed_name + ":" }}</h1>
                            <el-tree :data="value.data" :ref="key" show-checkbox default-expand-all node-key="id"
                                highlight-current :props="defaultProps" :default-checked-keys="value.default_checked_keys"
                                @check="handleCheck">
                            </el-tree>
                        </template> -->
                        <el-collapse-item v-for="(value, key) in checkbox_tree_data" :title="value.displayed_name"
                            :name="value.id" :key="value.id" :class="{ background_blue: !value.empty }">
                            <el-tree :data="value.data" :ref="key" show-checkbox default-expand-all node-key="id"
                                highlight-current :props="defaultProps"
                                :default-checked-keys="value.default_checked_keys" :expand-on-click-node="false"
                                check-on-click-node @check="handleCheck" @check-change="handleCheckChange">
                            </el-tree>
                        </el-collapse-item>
                    </el-collapse>
                    <!-- <div>
                        <el-button @click="get_diagnosisValue">get diagnosis value</el-button>
                    </div> -->
                </a-col>

                <!-- <a-col :span="span">
                    <a-form-model-item ref="cell_count" label="细胞量" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatCount(form.cell_count)" :data-source="cell_count" @select="onSelectCount"/>
                    </a-form-model-item>
                </a-col>
                <a-col :span="span">
                    <a-form-model-item ref="gland_cell" label="颈管细胞" :labelCol="{ span: 8 }" :wrapper-col="{ span: 16}">
                        <a-auto-complete :value="formatBool2Str(form.gland_cell)" :data-source="bool_list" @select="onSelectGland"/>
                    </a-form-model-item>
                </a-col> -->

                <a-col v-if="conclusion" :span="24">
                    <a-form-model-item :label="conclusion.displayed_name + ':'">
                        <a-textarea v-model="conclusion.value" placeholder="请填写诊断"
                            :auto-size="{ minRows: 3, maxRows: 6 }" />
                    </a-form-model-item>

                    <a-form-model-item v-for="(suggestion, suggestion_index) in conclusion.suggestion"
                        :label="suggestion.displayed_name" :key="suggestion.node_key">
                        <el-popover placement="right" width="200" trigger="hover">
                            <!-- <el-table :data="conclusion.input_template" @row-click="test">
                                <el-table-column width="150" prop="0"></el-table-column>
                            </el-table> -->
                            <a-list>
                                <a-list-item v-for="(item, index) in conclusion.input_template" :key="index"
                                    v-on:click="inputSuggestion(item, suggestion_index)">
                                    {{ item }}
                                </a-list-item>
                            </a-list>

                            <el-input type="textarea" v-model="suggestion.value" :auto-size="{ minRows: 1, maxRows: 3 }"
                                slot="reference">
                            </el-input>
                        </el-popover>
                    </a-form-model-item>
                </a-col>
                <!-- <br><br><br> -->
                <!-- <a-divider orientation="center" class="patient-form-content__divider" font-size="90%">病理诊断</a-divider>
                <a-col :span="24">
                    <div :style="{ width: '100%',overflow:'scroll'}">
                      <el-tree
                        :data="diagnosisList"
                        class="tree_app"
                        @node-click="handleNodeClick">
                      </el-tree>
                    </div>
                </a-col> -->


            </a-row>
        </a-form-model>
        <!-- / 表单 -->
    </div>
</template>

<script>
import { updateScan, getReportConfig } from '@/api/workspace'

export default {
    name: 'DiagnosisModel',
    data() {
        return {
            visible: false,
            confirmLoading: false,
            scan_info: {},
            labelCol: { span: 6 },
            wrapperCol: { span: 18 },
            activeName: "0",
            node_key_id_map: {},
            checked_keys: [],
            half_checked_keys: [],
            checkbox_config: [],
            tree_conclusion_template: {},
            conclusion: {},
            checkbox_tree_data: false,
            defaultProps: {
                children: 'children',
                label: 'displayed_name'
            },
        }
    },
    computed: {
        span() {
            return true ? 12 : 12
        }
    },
    methods: {
        //初始化
        async init(scan_info) {
            this.scan_info = scan_info
            this.id = scan_info.id
            if (scan_info.diagnosisValue) {
                console.log("diagnosisValue:", scan_info.diagnosisValue)
                this.diagnosisValue = scan_info.diagnosisValue;
            }
            else {
                this.updateDiagnosis(false)
            }

            // check diagnosisValue history value
            if (!(this.diagnosisValue && this.diagnosisValue.hasOwnProperty('checkbox') && this.diagnosisValue.hasOwnProperty('conclusion')
                && this.diagnosisValue.checkbox && this.diagnosisValue.conclusion)) {
                // get report config
                console.log("diagnosisValue not valid! so load template...")
                let report_config = await getReportConfig()
                // todo load template entity from DB
                if (report_config['config_file'] && report_config['config_file'].hasOwnProperty('checkbox')) {
                    // valid config
                    this.diagnosisValue = report_config['config_file']
                } else {
                    // not valid config
                    console.log("report_config file not valid!!")
                    this.diagnosisValue = report_config['config_file']
                }
            }
            this.checkbox_config = JSON.parse(JSON.stringify(this.diagnosisValue['checkbox']))
            this.conclusion = JSON.parse(JSON.stringify(this.diagnosisValue['conclusion']))

            // get tree data
            this.checkbox_tree_data = {}
            for (const [i, first_level_node] of this.checkbox_config.entries()) {
                console.log("processing first level checkbox node:", first_level_node.properties.node_key)
                if (first_level_node.properties.disabled) { continue; }
                let default_checked_keys = []
                let default_half_checked_keys = []
                let data = this.config_to_tree_data(i, first_level_node.properties.node_key, first_level_node.children, default_checked_keys, default_half_checked_keys)
                this.checkbox_tree_data[first_level_node.properties.node_key] = {
                    "id": i.toString(),
                    "node_key": first_level_node.properties.node_key,
                    "displayed_name": first_level_node.properties.displayed_name,
                    "data": data,
                    "default_checked_keys": default_checked_keys,
                    "empty": default_checked_keys.length === 0,
                    "checked_keys": default_checked_keys,
                    "half_checked_keys": default_half_checked_keys
                };
                this.node_key_id_map[first_level_node.properties.node_key] = i.toString()
                // console.log("default_checked_keys:", default_checked_keys)
                this.half_checked_keys.push(...default_half_checked_keys)
                this.checked_keys.push(...default_checked_keys)
            }
            // init tree conclusion template
            this.init_tree_conclusion_template()
            console.log("half_checked_keys:", this.half_checked_keys)
            console.log("checked_keys:", this.checked_keys)
            console.log("node_key_id_map:", this.node_key_id_map)
            console.log("checkbox_config:", this.checkbox_config)
            console.log("conclusion:", this.conclusion)
            console.log("checkbox_tree_data:", this.checkbox_tree_data)
            console.log("tree_conclusion_template:", this.tree_conclusion_template)
        },
        updateDiagnosis: function (flagStatus) {
            updateScan(this.id, {
                diagnosisValue: this.diagnosisValue,
            })
        },
        set_checkbox_value(checkbox_config_obj, key, value) {
            //   console.log(checkbox_config_obj, key, value)
            if (key.includes('.')) {
                let k = key.split('.')[0]
                let obj = checkbox_config_obj[k]
                this.set_checkbox_value(obj.children, key.substr(k.length + 1), value)
            } else {
                let k = key
                let obj = checkbox_config_obj[k]
                obj.properties.value = value
            }
        },
        get_checkbox_properties(checkbox_config_obj, key) {
            //   console.log(checkbox_config_obj, key, value)
            if (key.includes('.')) {
                let k = key.split('.')[0]
                let obj = checkbox_config_obj[k]
                return this.get_checkbox_properties(obj.children, key.substr(k.length + 1))
            } else {
                let k = key
                let obj = checkbox_config_obj[k]
                return obj.properties
            }
        },
        getCheckedKeys() {
            for (var key in this.checkbox_tree_data) {
                // console.log(this.$refs[key][0].getCheckedKeys());
                let checked_keys = this.$refs[key][0].getCheckedKeys();
                for (let ck of checked_keys) {
                    this.set_checkbox_value(this.checkbox_config, ck, true)
                }
            }
            console.log("new_result", this.checkbox_config)
        },
        config_to_tree_data(parent_id, parent_key, children, default_checked_keys, default_half_checked_keys) {
            var result_array = []
            for (const [i, child] of children.entries()) {
                if (child.properties.disabled) { continue; }
                var result = {
                    "id": parent_id + '.' + i,
                    "node_key": parent_key + '.' + child.properties.node_key,
                    "displayed_name": child.properties.displayed_name,
                    "excluding": child.properties.excluding,
                    'disabled': false
                }
                this.node_key_id_map[result["node_key"]] = result["id"]
                if (child.properties.value === 'checked') {
                    default_checked_keys.push(result['id']);
                    // reset values and get checkbox value when save
                    child.properties.value = "unchecked";
                } else if (child.properties.value === 'half_checked') {
                    default_half_checked_keys.push(result['id']);
                    // reset values and get checkbox value when save
                    child.properties.value = "unchecked";
                }
                if (child.children && child.children.length > 0) {
                    result['children'] = this.config_to_tree_data(result['id'], result['node_key'], child.children, default_checked_keys, default_half_checked_keys)
                }
                result_array.push(result)
            }
            return result_array
        },
        get_diagnosisValue() {
            let diagnosisValue = {}
            for (var key in this.checkbox_tree_data) {
                // console.log(this.$refs[key][0].getCheckedKeys());
                let checked_keys = this.$refs[key][0].getCheckedKeys();
                let half_checked_keys = this.$refs[key][0].getHalfCheckedKeys();
                for (let ck of checked_keys) {
                    this.set_checkbox_value(this.checkbox_config, ck, "checked")
                }
                for (let ck of half_checked_keys) {
                    this.set_checkbox_value(this.checkbox_config, ck, "half_checked")
                }
            }
            console.log("new_checkbox_config", this.checkbox_config)
            diagnosisValue['checkbox'] = this.checkbox_config
            console.log("new_conclusion", this.conclusion)
            diagnosisValue['conclusion'] = this.conclusion
            return diagnosisValue
        },
        // deprecated disable
        // set_disabled_tree_node_and_children(tree_data, key, disabled){
        //     console.log(tree_data, key)
        //     if (!tree_data) {return;}
        //     if (!key) {
        //         // empty or null, disable all list and children
        //         for (let child of tree_data) {
        //             child.disabled = disabled
        //             this.set_disabled_tree_node_and_children(child.children, null, disabled)
        //         }
        //     } else if (key.includes('.')) {
        //         let k = key.split('.')[0]
        //         let child = tree_data[k]
        //         this.set_disabled_tree_node_and_children(child.children, key.substr(k.length + 1))
        //     } else {
        //         let child = tree_data[key]
        //         child.disabled = disabled
        //         this.set_disabled_tree_node_and_children(child.children, null, disabled)
        //     }
        // },
        // disable_tree_nodes(checked_keys){
        //     for (let ck of checked_keys) {
        //         // get excluding
        //         let excluding = this.get_checkbox_properties(this.checkbox_config, ck).excluding
        //         console.log("excluding list:", excluding)
        //         for (let ex of excluding) {
        //             // get tree node
        //             console.log("excluding:", ex)
        //             let parent = ex.split('.')[0]
        //             let id = this.node_key_id_map[ex]
        //             if (id.includes('.')) {
        //                 id = id.substr(id.split('.')[0].length + 1)
        //             } else {
        //                 id = null
        //             }
        //             this.set_disabled_tree_node_and_children(this.checkbox_tree_data[parent]['data'], id, true)
        //         }
        //     }
        // },
        // reset_disabled_tree_nodes() {
        //     for (var key in this.checkbox_tree_data) {
        //         this.set_disabled_tree_node_and_children(this.checkbox_tree_data[key]['data'], null, false)
        //     }
        // },
        tree_conclusion_template_create_node(key) {
            console.log("tree_conclusion_template_create_node", key)
            let prop = this.get_checkbox_properties(this.checkbox_config, key)
            if (prop.conclusion_included) {
                let priority = prop.conclusion_priority
                let template = (prop.conclusion_template) ? prop.conclusion_template : prop.displayed_name
                if (priority >= 0) {
                    // line index
                    if (!this.tree_conclusion_template.hasOwnProperty(priority)) { this.tree_conclusion_template[priority] = []; }
                    let priority_conclusion_template = this.tree_conclusion_template[priority]
                    let skip_flag = false
                    for (let node of priority_conclusion_template) {
                        // check if already in priority_conclusion_template
                        if (node.id === key) {
                            skip_flag = true
                        }
                    }
                    if (skip_flag) { console.log("tree_conclusion_template_create_node skip node"); return [null, null] }
                    let node_template = {
                        'id': key,
                        'template': template,
                        'children': []
                    }
                    priority_conclusion_template.push(node_template)
                    console.log("tree_conclusion_template_create_node new node", node_template, true)
                    return [node_template, true]
                } else {
                    // follow parent
                    let parent_id = key.substr(0, key.length - (key.split('.').pop().length + 1))
                    let parent_prop = this.get_checkbox_properties(this.checkbox_config, parent_id)
                    let parent_priority = parent_prop.conclusion_priority
                    let parent_template = (parent_prop.conclusion_template) ? parent_prop.conclusion_template : parent_prop.displayed_name
                    if (!this.tree_conclusion_template.hasOwnProperty(parent_priority)) { this.tree_conclusion_template[parent_priority] = []; }
                    let priority_conclusion_template = this.tree_conclusion_template[parent_priority]
                    // get parent node template
                    let parent_node = null
                    let create_flag = false
                    for (let node of priority_conclusion_template) {
                        if (node.id === parent_id) {
                            parent_node = node
                        }
                    }
                    if (!parent_node) {
                        // create parent node if not exist
                        parent_node = {
                            'id': parent_id,
                            'template': parent_template,
                            'children': []
                        }
                        priority_conclusion_template.push(parent_node)
                        create_flag = true
                    }
                    // create child node
                    let child_node = {
                        'id': key,
                        'template': template
                    }
                    parent_node.children.push(child_node)
                    console.log("tree_conclusion_template_create_node new node", parent_node, create_flag)
                    return [parent_node, create_flag]
                }
            }
            console.log("conclusion included:false, skip node...")
            return [null, null]
        },
        init_tree_conclusion_template() {
            let all_keys = [...this.checked_keys, ...this.half_checked_keys]
            // init nodes templates info
            for (let ck of all_keys) {
                console.log("init_tree_conclusion_template processing:", ck)
                this.tree_conclusion_template_create_node(ck)
                console.log("after init tree_conclusion_template:", JSON.parse(JSON.stringify(this.tree_conclusion_template)))
            }
        },
        get_tree_conclusion_template_node_index(id) {
            console.log("get_tree_conclusion_template_node_index", id)
            let priorities = Object.keys(this.tree_conclusion_template)
            priorities.sort()
            let line_index = 0
            // console.log("get_tree_conclusion_template_node_index priorities", priorities)
            for (let priority of priorities) {
                let priority_conclusion_template = this.tree_conclusion_template[priority]
                // console.log("get_tree_conclusion_template_node_index priority_conclusion_template", priority_conclusion_template)
                for (const [i, node] of priority_conclusion_template.entries()) {
                    // console.log("get_tree_conclusion_template_node_index", i, node)
                    if (node.id === id) {
                        console.log("get_tree_conclusion_template_node_index result:", priority, i, line_index)
                        return [priority, i, line_index]
                    }
                    line_index += 1
                }
            }
            return [null, null, null]
        },
        get_tree_node_conclusion_template(priority, priority_id) {
            let node = this.tree_conclusion_template[priority][priority_id]
            let str = node.template
            if (node.children.length === 0) {
                return str
            } else {
                str += '——'
            }
            let children_str = []
            for (let child of node.children) {
                children_str.push(child.template)
            }
            str += children_str.join('、')
            return str
        },
        tree_conclusion_template_insert_node(priority, priority_id, line_index) {
            console.log("tree_conclusion_template_insert_node", priority, priority_id, line_index)
            let str = this.get_tree_node_conclusion_template(priority, priority_id)
            let conclusion = this.conclusion.value.split("\n")
            conclusion.splice(line_index, 0, str)
            this.conclusion.value = conclusion.join("\n")
        },
        tree_conclusion_template_update_node(priority, priority_id, line_index) {
            console.log("tree_conclusion_template_update_node", priority, priority_id, line_index)
            let str = this.get_tree_node_conclusion_template(priority, priority_id)
            let conclusion = this.conclusion.value.split("\n")
            conclusion[line_index] = str
            this.conclusion.value = conclusion.join("\n")
        },
        tree_conclusion_template_delete_node(priority, priority_id, line_index) {
            console.log("tree_conclusion_template_delete_node", priority, priority_id, line_index)
            this.tree_conclusion_template[priority].splice(priority_id, 1)
            let conclusion = this.conclusion.value.split("\n")
            conclusion.splice(line_index, 1)
            this.conclusion.value = conclusion.join("\n")
        },
        tree_conclusion_template_update(new_keys) {
            for (let key of new_keys) {
                console.log("tree_conclusion_template_update:", key)
                let [node, create_flag] = this.tree_conclusion_template_create_node(key)
                if (node) {
                    let [priority, priority_id, line_index] = this.get_tree_conclusion_template_node_index(node.id)
                    if (line_index == null) { console.log("fail to locate node. so skip..."); continue }
                    if (create_flag) {
                        // insert new node
                        this.tree_conclusion_template_insert_node(priority, priority_id, line_index)
                    } else {
                        // update node
                        this.tree_conclusion_template_update_node(priority, priority_id, line_index)
                    }
                } else {
                    // pass
                    continue
                }
            }
        },
        tree_conclusion_template_delete(deleted_keys) {
            for (let key of deleted_keys) {
                console.log("tree_conclusion_template_delete:", key)
                // update tree_conclusion_template
                let prop = this.get_checkbox_properties(this.checkbox_config, key)
                let priority = prop.conclusion_priority
                if (priority >= 0) {
                    // get index
                    let [_, priority_id, line_index] = this.get_tree_conclusion_template_node_index(key)
                    if (line_index == null) { console.log("fail to locate node. so skip..."); continue }
                    this.tree_conclusion_template_delete_node(priority, priority_id, line_index)
                } else {
                    let parent_id = key.substr(0, key.length - (key.split('.').pop().length + 1))
                    let parent_prop = this.get_checkbox_properties(this.checkbox_config, parent_id)
                    let parent_priority = parent_prop.conclusion_priority
                    let [_, parent_priority_id, line_index] = this.get_tree_conclusion_template_node_index(parent_id)
                    if (line_index == null) { console.log("fail to locate node. so skip..."); continue }
                    let parent_node = this.tree_conclusion_template[parent_priority][parent_priority_id]
                    let child_id = null
                    for (const [i, node] of parent_node.children.entries()) {
                        if (node.id === key) {
                            child_id = i
                            break
                        }
                    }
                    // delete child from parent
                    // console.log("delete children child_id:", child_id)
                    if (child_id !== null) { parent_node.children.splice(child_id, 1) }
                    // console.log("delete children:", parent_node)
                    // if no children delete line
                    if (parent_node.children.length === 0) {
                        // if no children delete line
                        this.tree_conclusion_template_delete_node(parent_priority, parent_priority_id, line_index)
                    } else {
                        // update line
                        this.tree_conclusion_template_update_node(parent_priority, parent_priority_id, line_index)
                    }
                }

            }
        },
        // deprecated
        // update_tree_template(checked_keys) {
        //     for (let ck of checked_keys) {
        //         // console.log("processing:", ck)
        //         let prop = this.get_checkbox_properties(this.checkbox_config, ck)
        //         if (prop.conclusion_included){
        //             let id = prop.conclusion_priority
        //             let template = (prop.conclusion_template) ? prop.conclusion_template : prop.displayed_name
        //             if (id >= 0) {
        //                 // line index
        //                 if (!this.tree_template.hasOwnProperty(id)) {this.tree_template[id] = [];}
        //                 let array_template = this.tree_template[id]
        //                 if (array_template.includes(template)) {continue}
        //                 let skip = false
        //                 for (let a of array_template) {
        //                     if (Array.isArray(a) && a.includes(template)) {
        //                         skip = true
        //                         break
        //                     }
        //                 }
        //                 if (skip) {continue}
        //                 array_template.push(template)
        //             } else {
        //                 // follow parent
        //                 let parent_prop = this.get_checkbox_properties(this.checkbox_config, ck.substr(0, ck.length - (ck.split('.').pop().length + 1)))
        //                 let parent_id = parent_prop.conclusion_priority
        //                 let parent_template = (parent_prop.conclusion_template) ? parent_prop.conclusion_template : parent_prop.displayed_name
        //                 if (!this.tree_template.hasOwnProperty(parent_id)) {this.tree_template[parent_id] = [];}
        //                 // filter parent_template if in array
        //                 this.tree_template[parent_id] = this.tree_template[parent_id].filter(e => e !== parent_template)
        //                 let array_template = this.tree_template[parent_id]
        //                 // add [parent_template, child_template] to array_template
        //                 let parent_templet_array = null
        //                 // console.log("tree_template:", this.tree_template)
        //                 for (let a of array_template) {
        //                     if (Array.isArray(a) && a[0] === parent_template) {
        //                         parent_templet_array = a
        //                         break
        //                     }
        //                 }
        //                 if (parent_templet_array) {
        //                     if (parent_templet_array.includes(template)) {continue}
        //                     parent_templet_array.push(template)
        //                 } else {
        //                     parent_templet_array = [parent_template, template]
        //                     array_template.push(parent_templet_array)
        //                 }
        //             }
        //         }
        //         // console.log("tree_template:", JSON.stringify(this.tree_template))
        //     }
        // },
        // tree_template_to_conclusion(){
        //     let result = this.conclusion.value
        //     result = result.split("\n")
        //     for (const [key, value] of Object.entries(this.tree_template)) {
        //         let array_template = []
        //         for (let v of value) {
        //             if (Array.isArray(v)) {
        //                 let str = v[0] + "——" + v.slice(1).join("、")
        //                 array_template.push(str)
        //             } else {
        //                 array_template.push(v)
        //             }
        //         }
        //         result[key] = array_template.join("，")
        //     }
        //     this.conclusion.value = result.join("\n")
        // },
        update_collapse_background(parent_name, empty) {
            console.log("set_collapse_background tree:", parent_name, "empty", this.checkbox_tree_data[parent_name].empty)
            this.checkbox_tree_data[parent_name].empty = empty
            // force update class, 否则class会在collapse被点击后update
            this.$forceUpdate();
        },
        update_tree_conclustion_template(parent_name, checkedKeys, halfCheckedKeys) {
            let parent_node = this.checkbox_tree_data[parent_name]
            let all_keys_last = [...parent_node.checked_keys, ...parent_node.half_checked_keys]
            let all_keys_now = [...checkedKeys, ...halfCheckedKeys]
            let deleted_keys = all_keys_last.filter(x => !all_keys_now.includes(x))
            let new_keys = all_keys_now.filter(x => !all_keys_last.includes(x))
            console.log("deleted_keys:", deleted_keys, "new_keys", new_keys)
            if (deleted_keys.length > 0) { this.tree_conclusion_template_delete(deleted_keys) }
            if (new_keys.length > 0) { this.tree_conclusion_template_update(new_keys) }
            // update tree checked keys
            parent_node.checked_keys = checkedKeys
            parent_node.half_checked_keys = halfCheckedKeys
        },
        handleCheck(node, data) {
            console.log("tree check event:", node, data)
            let parent_name = node.node_key.split('.')[0]
            // update checked keys and half checked keys, 需要吗？
            this.checked_keys = []
            this.half_checked_keys = []
            for (var key in this.checkbox_tree_data) {
                let checked_keys = this.$refs[key][0].getCheckedKeys();
                let half_checked_keys = this.$refs[key][0].getHalfCheckedKeys();
                this.checked_keys.push(...checked_keys)
                this.half_checked_keys.push(...half_checked_keys)
            }
            console.log("half_checked_keys:", this.half_checked_keys)
            console.log("checked_keys:", this.checked_keys)

            // update background blue
            this.update_collapse_background(parent_name, data.checkedKeys.length === 0)

            // update tree conclusion template
            this.update_tree_conclustion_template(parent_name, data.checkedKeys, data.halfCheckedKeys)
        },
        getNodeFathers(nodeID, idArray) {
            if (nodeID.includes('.')) {
                let k = nodeID.substring(0, nodeID.length - 2)
                idArray.push(k)
                this.getNodeFathers(k, idArray)
            } else {
                idArray.push(nodeID)
            }
        },
        handleCheckChange(node, check_status, _) {
            // excluding nodes, 只需要处理打勾状态，uncheck不做任何事情
            if (check_status) {
                let nodeID = node.id
                //获得当前node的所有父节点id
                let idArray = []
                idArray.push(nodeID)
                this.getNodeFathers(nodeID, idArray)
                //通过id获取excludings
                let excludingArray = []
                for (var id of idArray) {
                    let obj = this.get_checkbox_properties(this.checkbox_config, id)
                    if (obj.excluding.length > 0) {
                        excludingArray = excludingArray.concat(obj.excluding)
                    }
                }
                //console.log('====', excludingArray)
                //通过excluding获取id，setchecked
                for (let ex of excludingArray) {
                    let parent_name = ex.split('.')[0]
                    if (ex.includes('.')) {
                        let id = this.node_key_id_map[ex]
                        //setChecked
                        this.$refs[parent_name][0].setChecked(id, false, true)
                    } else {
                        let children = this.checkbox_tree_data[parent_name].data
                        for (let child of children) {
                            this.$refs[parent_name][0].setChecked(child.id, false, true)
                        }
                    }
                    // update tree conclusion template
                    this.update_tree_conclustion_template(parent_name, this.$refs[parent_name][0].getCheckedKeys(), this.$refs[parent_name][0].getHalfCheckedKeys())
                    // update collapse background
                    this.update_collapse_background(parent_name, this.$refs[parent_name][0].getCheckedKeys().length === 0)
                }
            }
        },
        inputSuggestion(suggestion, suggestion_index) {
            //console.log('==========:', suggestion, suggestion_index)
            let value = this.conclusion.suggestion[suggestion_index].value
            let str = (value) ? '，' + suggestion : suggestion
            this.conclusion.suggestion[suggestion_index].value += str
        },
        reportValidation() {
            if (this.conclusion['value'] && this.conclusion['value'].trim() && this.checked_keys && this.checked_keys.length > 0) {
                return true
            } else {
                return false
            }
        },
    }
}
</script>

<style>
.ant-form-item-label {
    margin-left: auto;
}

.a-form-model-item {
    margin-left: auto;
}

.background_blue .el-collapse-item__header {
    background-color: #98ccfd;
}
</style>
