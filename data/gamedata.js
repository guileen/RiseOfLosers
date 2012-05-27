var exports = module.exports = {
  cities: {
    '1': {
      id: 1
    , name: '北京'
    }
  , '2': {
      id: 2
    , name: '上海'
    }
  }

/*
○ 人民广场
○ 东方明珠 
金茂 环球
○ 城隍庙
○ 世博园
○ 徐家汇
○ 中山公园
○ 五角场转盘
○ 虹桥机场
○ 森林公园
○ 张江软件园
*/

, nodes: {
    '42': {
      id: 42
    , name: '上海火车站'
    , cityId: 2
    }
  , '46': {
      id: 46
    , name: '人民广场'
    , cityId: 2
    }
  // , '3': {
  //     id: 3
  //   , name: '东方明珠'
  //   , cityId: 2
  //   }
  , '57': {
      id: 57
    , name: '陆家嘴'
    , cityId: 2
    }
  , '37': {
      id: 37
    , name: '城隍庙'
    , cityId: 2
    }
  , '13': {
      id: 13
    , name: '世博园'
    , cityId: 2
    }
  , '36': {
      id: 36
    , name: '徐家汇'
    , cityId: 2
    }
  , '43': {
      id: 43
    , name: '中山公园'
    , cityId: 2
    }
  , '22': {
      id: 22
    , name: '五角场'
    , cityId: 2
    }
  , '7': {
      id: 7
    , name: '虹桥机场'
    , cityId: 2
    }
  , '3': {
      id: 3
    , name: '森林公园'
    , cityId: 2
    }
  , '16': {
      id: 16
    , name: '张江软件园'
    , cityId: 2
    }

  }
, goods: {
    1: {
      id: 1
    , name: '三鹿牛奶'
    , min: 50
    , max: 800
    , unit: '箱'
    }
  , 2: {
      id: 2
    , name: 'HiPhone 4S'
    , min: 300
    , max: 3000
    , unit: '箱'
    }
  , 3: {
      id: 3
    , name: '黑心棉床上四件套'
    , min: 1000
    , max: 8000
    , unit: '套'
    }
  , 4: {
      id: 4
    , name: '进口玛莎拉蒂'
    , min: 1000000
    , max: 10000000
    , unit: '辆'
    }
  , 5: {
      id: 5
    , name: '地沟油'
    , min: 2000
    , max: 20000
    , unit: '吨'
    }
  , 6: {
      id: 6
    , name: '苏丹红着色剂'
    , min: 3000
    , max: 30000
    , unit: '公斤'
    }
  , 7: {
      id: 7
    , name: '假中华香烟'
    , min: 500
    , max: 3000
    , unit: '条'

    }
  }
, events: {
    1: {

    }
  }

}
