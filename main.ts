function 常量初始化 () {
    常量_舵机_上臂开角度 = 135
    常量_舵机_上臂关角度 = 45
    常量_推杆时间 = 500
    basic.showIcon(IconNames.Chessboard)
}
function 遥控控制 () {
    if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.Tri)) {
        neZha.setMotorSpeed(neZha.MotorList.M3, -100)
        neZha.setMotorSpeed(neZha.MotorList.M4, -100)
        局部_内转标记 = 0
    } else {
        if (局部_内转标记 != 1) {
            neZha.setMotorSpeed(neZha.MotorList.M3, 0)
            neZha.setMotorSpeed(neZha.MotorList.M4, 0)
        }
    }
    if (PlanetX_Basic.get_Attention_Value(PlanetX_Basic.value_level.X)) {
        neZha.setMotorSpeed(neZha.MotorList.M3, 100)
        neZha.setMotorSpeed(neZha.MotorList.M4, 100)
        局部_内转标记 = 1
    }
}
function 启动初始化 () {
    basic.showIcon(IconNames.Yes)
}
// 运动模型正解:已知小车线速度、角速度 计算 左右轮的线速度
// 公式：vl = v+w*l/2
// ​          vr = v-w*l/2
// V线速度，向前正数
// w角速度，右转正数
// 
// 为了灵敏度W统一扩大一定倍数
// 轴距0.13M
function 速度解算 (v: number, w: number) {
    速度解算局部_v1 = (v - 0.13 * w * 10) * -1
    速度解算局部_v2 = (v + 0.13 * w * 10) * -1
    速度解算局部_MAX = 速度解算局部_v1
    if (速度解算局部_MAX < 速度解算局部_v2) {
        速度解算局部_MAX = 速度解算局部_v2
    }
    if (速度解算局部_MAX > 100) {
        neZha.setMotorSpeed(neZha.MotorList.M1, 速度解算局部_v1 / 速度解算局部_MAX * 100)
        neZha.setMotorSpeed(neZha.MotorList.M2, 速度解算局部_v2 / 速度解算局部_MAX * 100)
    } else {
        neZha.setMotorSpeed(neZha.MotorList.M1, 速度解算局部_v1)
        neZha.setMotorSpeed(neZha.MotorList.M2, 速度解算局部_v2)
    }
}
function 遥控移动 () {
    局部_RC_Y = Math.map(PlanetX_Basic.GetAnalogValue(PlanetX_Basic.value_A.LY), 0, 1023, -50, 50)
    局部_RC_X = Math.map(PlanetX_Basic.GetAnalogValue(PlanetX_Basic.value_A.RX), 0, 1023, -50, 50)
    if (Math.abs(局部_RC_X) <= 5) {
        局部_RC_X = 0
    }
    if (Math.abs(局部_RC_Y) <= 5) {
        局部_RC_Y = 0
    }
    速度解算(局部_RC_Y, 局部_RC_X)
}
let 局部_RC_X = 0
let 局部_RC_Y = 0
let 速度解算局部_MAX = 0
let 速度解算局部_v2 = 0
let 速度解算局部_v1 = 0
let 局部_内转标记 = 0
let 常量_推杆时间 = 0
let 常量_舵机_上臂关角度 = 0
let 常量_舵机_上臂开角度 = 0
常量初始化()
启动初始化()
basic.forever(function () {
    遥控移动()
    遥控控制()
})
