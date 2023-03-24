/**
* 字典映射
* Date: 2020/5/23
* Time: 4:13 下午
*/


// report config 模板
export const default_report_config = {
    "report_type": 1,
    "show_print_name": false,
    "checkbox": [
        {
            "properties": {
                "node_key": "specimen_satisfaction",
                "displayed_name": "标本满意度",
                "conclusion_template": null,
                "conclusion_included": false,
                "conclusion_priority": 0,
                "excluding": [],
                "value": "unchecked",
                "LIS_key": null,
                "LIS_parent_node": false,
                "LIS_value": null,
                "LIS_parent_default_value": null,
                "disabled": false
            },
            "children": [
                {
                    "properties": {
                        "node_key": "speicimen_satisfied",
                        "displayed_name": "满意",
                        "conclusion_template": null,
                        "conclusion_included": false,
                        "conclusion_priority": 0,
                        "excluding": ["specimen_satisfaction.speicimen_unsatisfied"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "squamous_cell",
                                "displayed_name": "鳞状上皮细胞",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "endocervical_cell",
                                "displayed_name": "颈管细胞",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "metaplastic_cell",
                                "displayed_name": "化生细胞",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "endometrial_cell",
                                "displayed_name": "内膜细胞",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        }
                    ]
                },
                {
                    "properties": {
                        "node_key": "speicimen_unsatisfied",
                        "displayed_name": "不满意",
                        "conclusion_template": null,
                        "conclusion_included": false,
                        "conclusion_priority": 0,
                        "excluding": ["specimen_satisfaction.speicimen_satisfied"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "squamous_cell_insufficient",
                                "displayed_name": "鳞状上皮细胞缺乏",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "cell_covered",
                                "displayed_name": "炎性细胞、血液、粘液或制片原因造成75%以上视野被遮挡",
                                "conclusion_template": null,
                                "conclusion_included": false,
                                "conclusion_priority": 0,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        }
                    ]
                }
            ]
        },
        {
            "properties": {
                "node_key": "microbiological_analysis",
                "displayed_name": "微生物分析",
                "conclusion_template": "微生物",
                "conclusion_included": false,
                "conclusion_priority": 1,
                "excluding": [],
                "value": "unchecked",
                "LIS_key": null,
                "LIS_parent_node": false,
                "LIS_value": null,
                "LIS_parent_default_value": null,
                "disabled": false
            },
            "children": [
                {
                    "properties": {
                        "node_key": "fungus",
                        "displayed_name": "真菌，形态上符合念珠菌",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": -1,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "trichomonad",
                        "displayed_name": "滴虫感染",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": -1,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "bacteria",
                        "displayed_name": "细菌感染",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": -1,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "herpes",
                        "displayed_name": "疱疹病毒感染",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": -1,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "actinomycetes",
                        "displayed_name": "放线菌感染",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": -1,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                }
            ]
        },
        {
            "properties": {
                "node_key": "squamous_cell_analysis",
                "displayed_name": "鳞状上皮细胞分析",
                "conclusion_template": null,
                "conclusion_included": false,
                "conclusion_priority": 0,
                "excluding": [],
                "value": "unchecked",
                "LIS_key": null,
                "LIS_parent_node": false,
                "LIS_value": null,
                "LIS_parent_default_value": null,
                "disabled": false
            },
            "children": [
                {
                    "properties": {
                        "node_key": "NILM",
                        "displayed_name": "未见上皮内病变或恶性病变(NILM)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["squamous_cell_analysis.ASC", "squamous_cell_analysis.LSIL", "squamous_cell_analysis.HSIL", "squamous_cell_analysis.SCC", "glandular_cell_analysis"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "benign_reactive_change",
                        "displayed_name": "良性反应性改变",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 2,
                        "excluding": [],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "inflammation",
                                "displayed_name": "炎症",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": [
                                {
                                    "properties": {
                                        "node_key": "mild",
                                        "displayed_name": "轻度",
                                        "conclusion_template": null,
                                        "conclusion_included": true,
                                        "conclusion_priority": -1,
                                        "excluding": [],
                                        "value": "unchecked",
                                        "LIS_key": null,
                                        "LIS_parent_node": false,
                                        "LIS_value": null,
                                        "LIS_parent_default_value": null,
                                        "disabled": true
                                    },
                                    "children": null
                                },
                                {
                                    "properties": {
                                        "node_key": "moderate",
                                        "displayed_name": "中度",
                                        "conclusion_template": null,
                                        "conclusion_included": true,
                                        "conclusion_priority": -1,
                                        "excluding": [],
                                        "value": "unchecked",
                                        "LIS_key": null,
                                        "LIS_parent_node": false,
                                        "LIS_value": null,
                                        "LIS_parent_default_value": null,
                                        "disabled": true
                                    },
                                    "children": null
                                },
                                {
                                    "properties": {
                                        "node_key": "severe",
                                        "displayed_name": "重度",
                                        "conclusion_template": null,
                                        "conclusion_included": true,
                                        "conclusion_priority": -1,
                                        "excluding": [],
                                        "value": "unchecked",
                                        "LIS_key": null,
                                        "LIS_parent_node": false,
                                        "LIS_value": null,
                                        "LIS_parent_default_value": null,
                                        "disabled": true
                                    },
                                    "children": null
                                }
                            ]
                        },
                        {
                            "properties": {
                                "node_key": "atrophy",
                                "displayed_name": "萎缩",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "intrauterine_device",
                                "displayed_name": "宫内节育器",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "radiotherapy",
                                "displayed_name": "放疗",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "gestation",
                                "displayed_name": "妊娠",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": true
                            },
                            "children": null
                        }
                    ]
                },
                {
                    "properties": {
                        "node_key": "ASC",
                        "displayed_name": "非典型鳞状上皮细胞",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["squamous_cell_analysis.NILM", "squamous_cell_analysis.LSIL", "squamous_cell_analysis.HSIL", "squamous_cell_analysis.SCC"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "ASC_US",
                                "displayed_name": "意义不明确(ASC-US)",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": ["squamous_cell_analysis.ASC.ASC_H"],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "ASC_H",
                                "displayed_name": "不除外高级别鳞状上皮内病变(ASC-H)",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": ["squamous_cell_analysis.ASC.ASC_US"],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        }
                    ]
                },
                {
                    "properties": {
                        "node_key": "LSIL",
                        "displayed_name": "低级别鳞状上皮内病变(LSIL)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["squamous_cell_analysis.NILM", "squamous_cell_analysis.ASC", "squamous_cell_analysis.HSIL", "squamous_cell_analysis.SCC"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "HSIL",
                        "displayed_name": "高级别鳞状上皮内病变(HSIL)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["squamous_cell_analysis.NILM", "squamous_cell_analysis.ASC", "squamous_cell_analysis.LSIL", "squamous_cell_analysis.SCC"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "SCC",
                        "displayed_name": "鳞状细胞癌(SCC)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["squamous_cell_analysis.NILM", "squamous_cell_analysis.ASC", "squamous_cell_analysis.LSIL", "squamous_cell_analysis.HSIL"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                }
            ]
        },
        {
            "properties": {
                "node_key": "glandular_cell_analysis",
                "displayed_name": "腺上皮细胞分析",
                "conclusion_template": null,
                "conclusion_included": false,
                "conclusion_priority": 0,
                "excluding": ["squamous_cell_analysis.NILM"],
                "value": "unchecked",
                "LIS_key": null,
                "LIS_parent_node": false,
                "LIS_value": null,
                "LIS_parent_default_value": null,
                "disabled": false
            },
            "children": [
                {
                    "properties": {
                        "node_key": "AGC_NOS",
                        "displayed_name": "非典型腺细胞病变，非特异(AGC-NOS)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["glandular_cell_analysis.AGC_FN", "glandular_cell_analysis.AIS", "glandular_cell_analysis.glandular_cancer"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "endocervical_cell",
                                "displayed_name": "颈管细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "endometrial_cell",
                                "displayed_name": "内膜细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "glandular_cell",
                                "displayed_name": "腺细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        }
                    ]
                },
                {
                    "properties": {
                        "node_key": "AGC_FN",
                        "displayed_name": "非典型腺细胞病变，倾向肿瘤(AGC-FN)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["glandular_cell_analysis.AGC_NOS", "glandular_cell_analysis.AIS", "glandular_cell_analysis.glandular_cancer"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": [
                        {
                            "properties": {
                                "node_key": "endocervical_cell",
                                "displayed_name": "颈管细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "endometrial_cell",
                                "displayed_name": "内膜细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": true
                            },
                            "children": null
                        },
                        {
                            "properties": {
                                "node_key": "glandular_cell",
                                "displayed_name": "腺细胞",
                                "conclusion_template": null,
                                "conclusion_included": true,
                                "conclusion_priority": -1,
                                "excluding": [],
                                "value": "unchecked",
                                "LIS_key": null,
                                "LIS_parent_node": false,
                                "LIS_value": null,
                                "LIS_parent_default_value": null,
                                "disabled": false
                            },
                            "children": null
                        }
                    ]
                },
                {
                    "properties": {
                        "node_key": "AIS",
                        "displayed_name": "原位腺癌(AIS)",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["glandular_cell_analysis.AGC_FN", "glandular_cell_analysis.AGC_NOS", "glandular_cell_analysis.glandular_cancer"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "glandular_cancer",
                        "displayed_name": "腺癌",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["glandular_cell_analysis.AGC_FN", "glandular_cell_analysis.AGC_NOS", "glandular_cell_analysis.AIS"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                }
            ]
        },
        {
            "properties": {
                "node_key": "P16_Ki67",
                "displayed_name": "P16/Ki-67细胞学双染检测结果",
                "conclusion_template": null,
                "conclusion_included": true,
                "conclusion_priority": 0,
                "excluding": [],
                "value": "unchecked",
                "LIS_key": null,
                "LIS_parent_node": false,
                "LIS_value": null,
                "LIS_parent_default_value": null,
                "disabled": true
            },
            "children": [
                {
                    "properties": {
                        "node_key": "positive",
                        "displayed_name": "阳性",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["P16_Ki67.negative"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                },
                {
                    "properties": {
                        "node_key": "negative",
                        "displayed_name": "阴性",
                        "conclusion_template": null,
                        "conclusion_included": true,
                        "conclusion_priority": 0,
                        "excluding": ["P16_Ki67.positive"],
                        "value": "unchecked",
                        "LIS_key": null,
                        "LIS_parent_node": false,
                        "LIS_value": null,
                        "LIS_parent_default_value": null,
                        "disabled": false
                    },
                    "children": null
                }
            ]
        }
    ],
    "screenshot": {
        "image_number": 1
    },
    "conclusion": {
        "node_key": "conclusion",
        "displayed_name": "诊断意见与建议",
        "value": "",
        "LIS_key": null,
        "disabled": false,
        "input_template": [
            "有非典型细胞，建议3-6个月复查。",
            "请阴道镜检查及活检。",
            "可见霉菌感染。",
            "可见滴虫感染。",
            "线索细胞大于20%。",
            "有子宫内膜细胞，请进一步检查。",
            "上皮细胞较少，结果供参考。",
            "极少上皮细胞，需要重新采样。"
        ],
        "suggestion": [
            {
                "node_key": "suggestion1",
                "displayed_name": "建议",
                "LIS_key": null,
                "value": ""
            }
        ]
    },
    "LIS": {
        "flag": false,
        "specimen_info": [{
            "node_key": "specimen_id",
            "LIS_key": "examine_id"
        }
        ],
        "scan_info": [{
            "node_key": "approver",
            "LIS_key": null
        }],
        "url_rule": [{
            "url": "http://domain:port/path",
            "examine_id_rule": ".*"
        }],
        "return_info": {
            "message_key": "message",
            "status_key": "status",
            "success_condition": {
                "key": "status",
                "value": 0
            }
        }
    }
}

/**
 * AI结果映射
 * @type {Map<number, string>}
 */
export const AIDiagnosisMapping = new Map([
    [0, '阴性'],
    [1, '阳性']
])

/**
 * 状态按钮颜色映射
 * @type {Map<string, string>}
 */
export const StatusColorMapping = new Map([
    ['qualityControlCreate', 'default'],
    ['qualityControlPass', 'primary'],
    ['qualityControlFail', 'danger'],
    ['scan', 'dashed'],
    ['failed', 'dashed'],
    ['predict', 'dashed'],
    ['predicted', 'danger'],
    ['authoring', 'danger'],
    ['authored', 'success'],
    ['approving', 'warning'],
    ['approved', 'success'],
    ['printing', 'success'],
    ['printed', 'primary']
])

/**
 * 状态按钮禁用映射
 * @type {Map<string, boolean>}
 */
export const StatusDisabledMapping = new Map([
    ['qualityControlCreate', true],
    ['qualityControlPass', false],
    ['qualityControlFail', false],
    ['scan', true],
    ['failed', true],
    ['predict', false],
    ['predicted', false],
    ['authoring', false],
    ['authored', false],
    ['approving', false],
    ['approved', false],
    ['printing', true],
    ['printed', false]
])

/**
 * 状态文本映射
 * @type {Map<string, string>}
 */
export const StatusTextMapping = new Map([
    ['qualityControlCreate', '质控中'],
    ['qualityControlPass', '质控 √'],
    ['qualityControlFail', '质控 X'],
    ['scan', '扫描中'],
    ['failed', '扫描失败'],
    ['predict', '等待判读'],
    ['ContextInferring', '判读中'],
    ['ContextInferred', '等待判读'],
    ['DetectionInferring', '判读中'],
    ['predicted', '待初审'],
    ['authoring', '初审中'],
    ['authored', '待复审'],
    ['approving', '复审中'],
    ['approved', '待打印'],
    ['printing', '打印中'],
    ['printed', '已完成']
])

/**
 * 满意度映射
 * @type {Map<number, string>}
 */
export const SatisfyMapping = new Map([
    [0, '未知'],
    [1, '满意'],
    [2, '基本满意'],
    [3, '需要重新采样']
])

/**
 * 炎症程度映射
 * @type {Map<number, string>}
 */
export const InflammationMapping = new Map([
    [0, '正常(<25%)'],
    [1, '轻度'],
    [2, '中度'],
    [3, '中度']
])

/**
 * 细胞量映射
 * @type {Map<number, string>}
 */
export const RadioCellMapping = new Map([
    [0, '20%'],
    [1, '>20%'],
    [2, '>40%'],
    [3, '>60%']
])

/**
 * 颜色映射
 * @type {Map<any, string>}
 */
export const TypeColorMapping = new Map([
    ['ASCUS', 'purple'],
    ['LSIL', 'purple'],
    ['ASC-H', 'red'],
    ['HSIL', 'red'],
    ['SCC', 'red'],
    ['AGC-NOS', 'blue'],
    ['AGC-FN', 'blue'],
    ['AGC', 'blue'],
    ['AIS', 'blue'],
    ['ADCA', 'blue'],
    ['parasite', 'green'],
    ['fungal', 'green'],
    ['indicators', 'green'],
    ['actinomyces', 'green'],
    ['herpes', 'green'],
    ['endometrial', 'blue'],
    ['', 'black'],
    [null, 'black'],
    [undefined, 'black'],
    ['Positive', 'black'],
    [0, 'black']
])

/**
 * 切片类名映射
 * @type {Map<any, string>}
 */
export const ClassNameMapping = new Map([
    [1, 'ASCUS'],
    [2, 'LSIL'],
    [3, 'ASC-H'],
    [4, 'HSIL'],
    [5, 'SCC'],
    [6, 'AGC-NOS'],
    [7, 'AGC-FN'],
    [8, 'AIS'],
    [9, 'ADCA'],
    [10, 'parasite'],
    [11, 'fungal'],
    [12, 'actinomyces'],
    [13, 'herpes'],
    [14, 'indicators'],
    [15, 'endometrial'],
    ['', 'OTHER'],
    [null, 'OTHER'],
    [undefined, 'OTHER'],
    [0, 'OTHER']
])
