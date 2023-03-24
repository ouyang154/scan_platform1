<template>
    <div>
        <el-row class="header">
            <el-button type="danger" size="medium" @click="resetAll">重置</el-button>
            <el-button type="primary" size="medium" @click="updateAll">保存</el-button>
        </el-row>
        <el-row>
            <!-- checkbox tree -->
            <el-col :span="8">
                <el-card v-if="checkbox_tree_data" :style="{ width: '100%' }">
                    <div slot="header">
                        <span class="editor">checkbox报告树编辑</span>
                    </div>
                    <template>
                        <el-dialog title="properties" :visible.sync="dialogFormVisible" @closed="inputVisible = false">
                            <el-form :model="properties" label-width="170px">
                                <el-form-item label="conclusion_included:">
                                    <el-switch v-model="properties.conclusion_included"></el-switch>
                                </el-form-item>
                                <el-form-item label="conclusion_priority:">
                                    <el-input-number v-model="properties.conclusion_priority" @change="handleChange"
                                        :min="0" :max="10"></el-input-number>
                                </el-form-item>
                                <el-form-item label="conclusion_template:">
                                    <el-input placeholder="null。 if null, 默认为displayed_name。"
                                        v-model="properties.conclusion_template" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="disabled:">
                                    <el-switch v-model="properties.disabled"></el-switch>
                                </el-form-item>
                                <el-form-item label="displayed_name:">
                                    <el-input v-model="properties.displayed_name" autocomplete="off"></el-input>
                                </el-form-item>

                                <el-form-item label="excluding:">
                                    <el-tag :key="tag" v-for="tag in properties.excluding" closable
                                        :disable-transitions="false" @close="handleClose(tag)">
                                        {{ tag }}
                                    </el-tag>
                                    <el-select class="input-new-tag" v-if="inputVisible" v-model="inputValue" filterable
                                        ref="saveTagInput" size="mini" placeholder="请选择" @change="handleInputConfirm">
                                        <el-option v-for="(item, index) in excludingCandidateListFiltered" :key="index"
                                            :value="item">
                                        </el-option>
                                    </el-select>
                                    <el-button v-else class="button-new-tag" size="small" @click="showExcludingList">+
                                        New Tag
                                    </el-button>
                                </el-form-item>

                                <el-form-item label="node_key:">
                                    <el-input v-model="properties.node_key" autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="LIS_key:">
                                    <el-input placeholder="please enter" v-model="properties.LIS_key"
                                        autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="LIS_parent_node:">
                                    <el-switch v-model="properties.LIS_parent_node"></el-switch>
                                </el-form-item>
                                <el-form-item label="LIS_value:">
                                    <el-input placeholder="please enter" v-model="properties.LIS_value"
                                        autocomplete="off"></el-input>
                                </el-form-item>
                                <el-form-item label="LIS_parent_default_value:">
                                    <el-input placeholder="please enter" v-model="properties.LIS_parent_default_value"
                                        autocomplete="off"></el-input>
                                </el-form-item>

                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false, inputVisible = false">Cancel</el-button>
                                <el-button type="primary" @click="updateProperties">Confirm</el-button>
                            </span>
                        </el-dialog>

                        <el-tree :data="checkbox_tree_data" default-expand-all highlight-current
                            :expand-on-click-node="false" :props="defaultProps" @node-click="handleNodeClick">
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button type="text" size="mini" @click="() => append(data)">
                                        增加子项
                                    </el-button>
                                    <el-button type="text" size="mini" @click="() => remove(node, data)">
                                        删除
                                    </el-button>
                                </span>
                            </span>
                        </el-tree>
                    </template>
                </el-card>
            </el-col>

            <el-col :span="8">
                <!-- conclusion part -->
                <el-card :style="{ width: '100%' }">
                    <div slot="header">
                        <span class="editor">conclusion报告结论编辑</span>
                    </div>
                    <el-form :model="conclusion" label-width="130px">
                        <el-form-item label="node_key（节点字段）:">
                            <el-input v-model="conclusion.node_key"></el-input>
                        </el-form-item>
                        <el-form-item label="displayed_name（页面显示名称）:">
                            <el-input v-model="conclusion.displayed_name"></el-input>
                        </el-form-item>
                        <el-form-item label="LIS_key（接口字段名）:">
                            <el-input placeholder="please enter" v-model="conclusion.LIS_key"></el-input>
                        </el-form-item>
                        <el-form-item label="disabled（开关）:">
                            <el-switch v-model="conclusion.disabled"></el-switch>
                        </el-form-item>
                        <el-form-item label="input_template（输入模版）:">
                            <el-tag :key="tag" v-for="tag in conclusion.input_template" closable
                                :disable-transitions="false" @close="handleCloseConclusion(tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                                size="mini" @keyup.enter.native="handleInputConfirmConclusion"
                                @blur="handleInputConfirmConclusion">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="editInputTemplate">+ New Tag
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <!-- <el-button type="warning" @click="resetConclusion">重置</el-button> -->
                    <el-card>
                        <div slot="header">
                            <span class="editor-subtitle">suggestion建议栏编辑
                                <el-button type="success" @click="addSuggestion">+新增suggestion</el-button>
                            </span>
                        </div>
                        <el-form v-for="(suggestion, index) in conclusion.suggestion" :key="index" label-width="130px">
                            <el-form-item label-width="0px" class="subtitle">{{ suggestion.node_key }}</el-form-item>
                            <el-form-item label="node_key（节点名）:">
                                <el-input v-model="suggestion.node_key"></el-input>
                            </el-form-item>
                            <el-form-item label="displayed_name（显示名）:">
                                <el-input placeholder="please enter" v-model="suggestion.displayed_name"></el-input>
                            </el-form-item>
                            <el-form-item label="LIS_key（接口名）:">
                                <el-input placeholder="please enter" v-model="suggestion.LIS_key"></el-input>
                            </el-form-item>
                            <!-- <el-button type="warning" @click="resetConclusion">重置</el-button> -->
                            <el-button type="danger" @click="deleteConclusion(index)">删除</el-button>
                        </el-form>
                    </el-card>
                </el-card>
                <!-- 其余项 -->
                <el-card>
                    <div slot="header">
                        <span class="editor">其余项编辑</span>
                    </div>
                    <el-form :model="report_config" label-width="200px">
                        <el-form-item label="report_type（报告类型）:">
                            <el-input-number v-model="report_config.report_type" @change="handleChange" :min="0"
                                :max="10"></el-input-number>
                        </el-form-item>
                        <el-form-item label="show_print_name（pdf报告显示用户名）:">
                            <el-switch v-model="report_config.show_print_name"></el-switch>
                        </el-form-item>
                        <el-form-item label="image_number（报告页截图数量）:">
                            <el-input-number v-model="screenshot.image_number" @change="handleChange" :min="0"
                                :max="10"></el-input-number>
                        </el-form-item>
                        <!-- <el-button type="warning" @click="resetOther">重置</el-button> -->
                    </el-form>
                </el-card>
            </el-col>

            <el-col v-if="LIS" :span="8">
                <!-- LIS part -->
                <el-card>
                    <div slot="header">
                        <span class="editor">LIS相关编辑</span>
                    </div>
                    <el-form :model="LIS" label-width="160px">
                        <el-form-item label="开关:">
                            <el-switch v-model="LIS.flag"></el-switch>
                        </el-form-item>
                        <el-form-item label="请求的content_type:">
                            <el-switch inactive-color="#ff4949" v-model="LIS.content_type" 
                            active-value="json" inactive-value="form-data"
                            active-text="application/json" inactive-text="multipart/form-data"></el-switch>
                        </el-form-item>
                        <!-- specimen_info -->
                        <el-card>
                            <div slot="header">
                                <span class="editor-subtitle">specimen_info病人字段编辑
                                    <el-button type="success" @click="addSpecimenInfo">+新增</el-button>
                                </span>
                            </div>
                            <el-form v-for="(item, index) in LIS.specimen_info" :key="index" label-width="160px">
                                <el-form-item label-width="0px" class="subtitle">第{{ index + 1 }}项</el-form-item>
                                <el-form-item label="数据库字段:">
                                    <el-input v-model="item.node_key"></el-input>
                                </el-form-item>
                                <el-form-item label="LIS接口字段:">
                                    <el-input placeholder="如不输入，默认与node_key相同" v-model="item.LIS_key"></el-input>
                                </el-form-item>
                                <el-button type="danger" @click="deleteSpecimenInfo(index)">删除</el-button>
                            </el-form>
                        </el-card>
                        <!-- scan_info -->
                        <el-card>
                            <div slot="header">
                                <span class="editor-subtitle">scan_info扫描字段编辑
                                    <el-button type="success" @click="addScanInfo">+新增</el-button>
                                </span>
                            </div>
                            <el-form v-for="(item, index) in LIS.scan_info" :key="index" label-width="160px">
                                <el-form-item label-width="0px" class="subtitle">第{{ index + 1 }}项</el-form-item>
                                <el-form-item label="数据库字段:">
                                    <el-input v-model="item.node_key"></el-input>
                                </el-form-item>
                                <el-form-item label="LIS接口字段:">
                                    <el-input placeholder="如不输入，默认与node_key相同" v-model="item.LIS_key"></el-input>
                                </el-form-item>
                                <el-button type="danger" @click="deleteScanInfo(index)">删除</el-button>
                            </el-form>
                        </el-card>
                        <!-- patient_info_api -->
                        <el-card v-if="LIS.patient_info_api">
                            <div slot="header">
                                <span class="editor-subtitle">patient_info_api 获取病人信息接口设置
                                </span>
                            </div>
                            <el-form label-width="160px">
                                <el-form-item label="开关:">
                                    <el-switch v-model="LIS.patient_info_api.flag"></el-switch>
                                </el-form-item>
                                <el-form-item label="接口url:">
                                    <el-input v-model="LIS.patient_info_api.url" autocomplete="off"></el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>

                        <!-- url_rule -->
                        <el-card>
                            <div slot="header">
                                <span class="editor-subtitle">提交报告接口设置
                                    <el-button type="success" @click="addUrlRule">+新增</el-button>
                                </span>
                            </div>
                            <el-form v-for="(item, index) in LIS.url_rule" :key="index" label-width="160px">
                                <el-form-item label-width="0px" class="subtitle">第{{ index + 1 }}项</el-form-item>
                                <el-form-item label="接口url:">
                                    <el-input v-model="item.url"></el-input>
                                </el-form-item>
                                <el-form-item label="匹配规则:">
                                    <el-input v-model="item.examine_id_rule"></el-input>
                                </el-form-item>
                                <el-button type="danger" @click="deleteUrlRule(index)">删除</el-button>
                            </el-form>
                        </el-card>
                        <!-- return_info -->
                        <el-card>
                            <div slot="header">
                                <span class="editor-subtitle">提交报告反馈设置</span>
                            </div>
                            <el-form label-width="160px">
                                <el-form-item label="message_key（返回消息字段）:">
                                    <el-input placeholder="please enter" v-model="LIS.return_info.message_key">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="status_key（返回状态字段）:">
                                    <el-input placeholder="please enter" v-model="LIS.return_info.status_key">
                                    </el-input>
                                </el-form-item>
                                <el-form-item label="成功判断key:">
                                    <el-radio-group v-model="LIS.return_info.success_condition.key">
                                        <el-radio label="status_code"></el-radio>
                                        <el-radio label="status"></el-radio>
                                        <el-radio label="message"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="成功判断value:">
                                    <el-input v-model="LIS.return_info.success_condition.value" @blur="changeDataType">
                                        <el-select v-model="success_condition_datatype" slot="prepend" placeholder="请选择"
                                            style="width: 100px" @change="changeDataType">
                                            <el-option label="数字" value="1"></el-option>
                                            <el-option label="字符串" value="2"></el-option>
                                        </el-select>
                                    </el-input>
                                </el-form-item>
                            </el-form>
                        </el-card>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { getReportConfig, updateReportConfig } from '@/api/workspace'

export default {
    data() {
        return {
            report_config_source: {},
            report_config: {},
            checkbox_config: [],
            checkbox_tree_data: false,
            conclusion: {},
            screenshot: {},
            LIS: null,
            defaultProps: {
                children: 'children',
                label: 'displayed_name'
            },
            excludingCandidateList: [],
            excludingCandidateListFiltered: [],
            properties: {},
            id: '',
            dialogFormVisible: false,
            inputVisible: false,
            inputValue: '',
            flag_append: false,
            flag_remove: false,
            node_append: {},
            success_condition_datatype: "1",
        }
    },

    mounted() {
        this.init()
    },

    methods: {
        async init() {
            // load hospital
            let reportConfig = await getReportConfig()
            // check report config and load
            if (reportConfig['config_file'] && reportConfig['config_file'].hasOwnProperty('checkbox') && reportConfig['config_file'].hasOwnProperty('LIS')) {
                this.report_config_source = reportConfig['config_file']
            } else {
                console.error('report config not valid!')
                this.report_config_source = reportConfig['config_file']
            }
            this.report_config = JSON.parse(JSON.stringify(this.report_config_source));
            this.screenshot = this.report_config.screenshot
            this.checkbox_source = this.report_config.checkbox;
            this.checkbox_config = JSON.parse(JSON.stringify(this.checkbox_source));
            this.checkbox_tree_data = this.configToTreeDataFinal();
            // create exluding candidate list
            this.generateExcludingCandidateList(this.checkbox_source, '');

            this.conclusion_source = this.report_config.conclusion
            this.conclusion = JSON.parse(JSON.stringify(this.conclusion_source))
            this.LIS_source = this.report_config.LIS
            this.LIS = JSON.parse(JSON.stringify(this.LIS_source))
            // get success_condition_datatype
            if (typeof this.LIS.return_info.success_condition.value === 'string') {
                // default success_condition_datatype = '1' int type
                this.success_condition_datatype = '2'
            }
            // add default content for patient_info_api
            if (!this.LIS.hasOwnProperty('patient_info_api')) {
                this.LIS.patient_info_api = {
                    "flag": false,
                    "url": "http://domain:port/path"
                }
                console.log(this.LIS)
            }

        },
        generateExcludingCandidateList(obj, father) {
            for (let i = 0; i < obj.length; i++) {
                let child = []
                if (!father) {
                    child = obj[i].properties.node_key
                    this.excludingCandidateList.push(child)
                } else {
                    child = father + '.' + obj[i].properties.node_key
                    this.excludingCandidateList.push(child)
                }
                if (obj[i].children) {
                    this.generateExcludingCandidateList(obj[i].children, child)
                }
            }
        },
        configToTreeData(tree_data, parent_id = '') {
            var result_array = []
            for (const [i, node] of tree_data.entries()) {
                //传入id
                var id_content = ''
                if (parent_id.length < 1) {
                    id_content = i.toString()
                    parent_id = i.toString()
                } else {
                    id_content = parent_id + '.' + i
                    parent_id += '.' + i
                }
                //传入properties
                var result = {
                    'id': id_content,
                    "properties": node.properties,
                    "displayed_name": node.properties.displayed_name,
                }
                //传入children
                if (node.children && node.children.length > 0) {
                    result['children'] = this.configToTreeData(node.children, parent_id)
                }
                result_array.push(result)
                if (parent_id.length > 1) {
                    parent_id = parent_id.substring(0, parent_id.length - 2)
                } else {
                    parent_id = ''
                }
            }
            if (parent_id.length > 1) {
                parent_id = parent_id.substring(0, parent_id.length - 2)
            } else {
                parent_id = ''
            }
            return result_array
        },
        configToTreeDataFinal() {
            let result_array = this.configToTreeData(this.checkbox_config, '');
            //Add root
            let result_array_add_root = []
            result_array_add_root.push({ id: '00', displayed_name: 'checkbox', children: [] })
            for (let i = 0; i < result_array.length; i++) {
                result_array_add_root[0].children.push(result_array[i])
            }
            return result_array_add_root
        },

        handleNodeClick(node_obj, _, __) {
            if (this.flag_remove) {
                this.dialogFormVisible = false;
            } else {
                this.dialogFormVisible = true;
            }

            if (!this.flag_append) {
                this.properties = node_obj.properties;
            } else {
                this.flag_append = false
                this.properties = this.node_append.properties
            }
        },
        updateProperties() {
            this.dialogFormVisible = false
            this.checkbox_tree_data = this.configToTreeDataFinal();
            this.inputVisible = falsetemplate
        },

        handleChange(value) {
        },
        handleClose(tag) {
            this.properties.excluding.splice(this.properties.excluding.indexOf(tag), 1);
        },

        showExcludingList() {
            this.excludingCandidateListFiltered = JSON.parse(JSON.stringify(this.excludingCandidateList));
            if (this.properties.excluding.length > 0) {
                let new_array = []
                for (let i = 0; i < this.properties.excluding.length; i++) {
                    new_array = this.excludingCandidateListFiltered.filter(item => item != this.properties.excluding[i])
                }
                this.excludingCandidateListFiltered = new_array
            }
            this.inputVisible = true;
        },

        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (!this.properties.excluding) {
                this.properties.excluding = []
            }
            if (inputValue) {
                this.properties.excluding.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        append(data) {
            const newChild = {
                children: [], properties: {
                    conclusion_included: false,
                    conclusion_template: "",
                    conclusion_priority: 0,
                    disabled: false,
                    displayed_name: "请点击编辑properties内容",
                    excluding: [],
                    node_key: "",
                    value: "",
                    LIS_key: null,
                    LIS_parent_node: false,
                    LIS_value: null,
                    LIS_parent_default_value: null,
                }
            };

            if (data.id == '00') {
                this.checkbox_config.push(newChild)
                this.node_append = this.checkbox_config[this.checkbox_config.length - 1]
            } else {
                let id_array = data.id.split('.')
                //找到checkbox_config里对应的node
                let node_in_config = this.searchNode(0, id_array, this.checkbox_config);
                if (!node_in_config.children) {
                    this.$set(node_in_config, 'children', []);
                }
                node_in_config.children.push(newChild);
                this.node_append = node_in_config.children[node_in_config.children.length - 1]
            }

            this.checkbox_tree_data = this.configToTreeDataFinal();
            this.flag_append = true
        },

        remove(node, data) {
            let id_array = data.id.split('.');
            if (id_array.length == 1) {
                const index = this.checkbox_config.findIndex(d => d.properties.displayed_name == data.displayed_name)
                this.checkbox_config.splice(index, 1)
            } else {
                id_array.pop()
                let node_parent = this.searchNode(0, id_array, this.checkbox_config);
                const children = node_parent.children;
                const index = children.findIndex(d => d.properties.displayed_name == data.displayed_name);
                children.splice(index, 1);
            }
            this.checkbox_tree_data = this.configToTreeDataFinal();
            this.flag_remove = true
        },

        searchNode(i, id_array, obj) {
            if (i < id_array.length - 1) {
                i += 1
                return this.searchNode(i, id_array, obj[id_array[i - 1]].children)
            } else {
                return obj[id_array[i]]
            }

        },
        handleCloseConclusion(tag) {
            this.conclusion.input_template.splice(this.conclusion.input_template.indexOf(tag), 1);
        },
        handleInputConfirmConclusion() {
            let inputValue = this.inputValue;
            if (!this.conclusion.input_template) {
                this.conclusion.input_template = []
            }
            if (inputValue) {
                this.conclusion.input_template.push(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },
        editInputTemplate() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // resetConclusion() {
        //     this.conclusion = JSON.parse(JSON.stringify(this.conclusion_source));
        // },

        addSuggestion() {
            let newItem = {
                "node_key": "suggestion" + (this.conclusion.suggestion.length + 1),
                "displayed_name": "",
                "value": ""
            }
            this.conclusion.suggestion.push(newItem)
            this.conclusion_source = JSON.parse(JSON.stringify(this.conclusion));
        },
        deleteConclusion(index) {
            this.conclusion.suggestion.splice(index, 1)
            this.conclusion_source = JSON.parse(JSON.stringify(this.conclusion));
        },
        addSpecimenInfo() {
            let newItem = {
                "node_key": "specimen_id",
                "LIS_key": "examine_id"
            }
            this.LIS.specimen_info.push(newItem)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        deleteSpecimenInfo(index) {
            this.LIS.specimen_info.splice(index, 1)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        addScanInfo() {
            let newItem = {
                "node_key": "approver",
                "LIS_key": ""
            }
            this.LIS.scan_info.push(newItem)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        deleteScanInfo(index) {
            this.LIS.scan_info.splice(index, 1)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        addUrlRule() {
            let newItem = {
                "url": "http://domain:port/path",
                "examine_id_rule": "*"
            }
            this.LIS.url_rule.push(newItem)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        deleteUrlRule(index) {
            this.LIS.url_rule.splice(index, 1)
            this.LIS_source = JSON.parse(JSON.stringify(this.LIS));
        },
        changeDataType() {
            if (this.LIS.return_info.success_condition.value != null) {
                if (this.success_condition_datatype === '1') {
                    let item = Number(this.LIS.return_info.success_condition.value)
                    this.LIS.return_info.success_condition.value = item
                } else {
                    let item = this.LIS.return_info.success_condition.value.toString()
                    this.LIS.return_info.success_condition.value = item
                }
            }
        },
        resetOther() {
            this.report_config = JSON.parse(JSON.stringify(this.report_config_source));
            this.screenshot = this.report_config.screenshot
        },

        resetAll() {
            this.init()
            this.$message.success('已重置！')
        },
        async updateAll() {
            this.report_config.checkbox = this.checkbox_config
            this.report_config.conclusion = this.conclusion
            this.report_config.LIS = this.LIS
            this.report_config_source = this.report_config
            await updateReportConfig({ config_file: this.report_config_source })
            this.$message.success('已保存！')
        },
    }
};
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.editor {
    background-color: #909399;
    color: whitesmoke;
    padding: 20px;
    border-radius: 4px;
    font-size: 18px;
}

.editor-subtitle {
    font-weight: bold;
    color: #606266;
    padding: 20px;
    border-radius: 4px;
    font-size: 18px;
}

.header {
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

}

.subtitle {
    font-weight: bold;
    margin-left: 20px;
    font-size: 18px;
    color: #606266;
}
</style>