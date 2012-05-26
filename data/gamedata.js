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
, nodes: {
    '1': {
      id: 1
    , name: '东方明珠'
    , cityId: 2
    // , conn: [2, 3, 4, 5]
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
    , name: 'hiPhone 4S'
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
  }

}
