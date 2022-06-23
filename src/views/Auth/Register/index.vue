<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-08 22:20:57
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-25 15:22:05
-->
<template>
    <div class="AuthUI-card flex-column">
        <div class="AuthUI-card__title flex-center">註冊</div>
        <div class="AuthUI-card__tips flex-center">請註冊後登入</div>

        <div class="AuthUI-card__tabs">
            <a-tabs default-active-key="1" @change="">
                <a-tab-pane key="1" tab="郵箱註冊">
                    <a-form-model ref="ruleForm" :model="form" :rules="rules">
                        <a-form-model-item
                            ref="email"
                            prop="email"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.email"
                                placeholder="請輸入電子郵件地址"
                                @blur="
                                    () => {
                                        $refs.email.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="mail" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item
                            ref="password"
                            prop="password"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.password"
                                placeholder="請輸入登入密碼"
                                type="text"
                                @blur="
                                    () => {
                                        $refs.password.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="lock" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item
                            ref="userName"
                            prop="userName"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.userName"
                                placeholder="請輸入姓名全稱"
                                @blur="
                                    () => {
                                        $refs.userName.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="user" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item
                            ref="companyName"
                            prop="companyName"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.companyName"
                                placeholder="請輸入公司全稱"
                                @blur="
                                    () => {
                                        $refs.companyName.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="shop" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item
                            ref="mobile"
                            prop="mobile"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.mobile"
                                placeholder="請輸入電話號碼"
                                @blur="
                                    () => {
                                        $refs.mobile.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="phone" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <myButton
                                class="AuthUI-btn--big"
                                theme="orange"
                                :isRound="true"
                                :text="isRegisterLoading ? '註冊中' : '註冊'"
                                :loading="isRegisterLoading"
                                @click="onRegister"
                            />
                        </a-form-model-item>

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <div
                                class="AuthUI-btn--link flex-center cursor-pointer"
                                @click="redirectLogin"
                            >
                                {{ `< 返回登入` }}
                            </div>
                        </a-form-model-item>
                    </a-form-model>
                </a-tab-pane>
            </a-tabs>
        </div>

        <a-modal
            title="恭喜，賬號註冊成功！"
            :visible="timerCount > 0"
            okText="去登入"
            cancelText="取消"
            @ok="redirectLogin"
            @cancel="closeTimer"
        >
            <div class="flexCenter">
                <!-- <a-icon type="success" style="font-size: 30px" /> -->
                <span class="bold-text icon--red">
                    {{ timerCount }}
                </span>
                秒後自動跳轉至登入頁面。<br />
            </div>
        </a-modal>
    </div>
</template>

<script>
// @ is an alias to /src
import myButton from "@/components/Common/myButton";
export default {
    name: "Login",
    components: {
        myButton,
    },
    data() {
        return {
            // labelCol: { span: 4 },
            // wrapperCol: { span: 14 },
            other: "",
            form: {
                email: "",
                password: "",
                userName: "",
                mobile: "",
                companyName: "",
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: "請輸入電子郵件",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "長度應介於3至20",
                        trigger: "blur",
                    },
                ],
                password: [
                    { required: true, message: "請輸入密碼", trigger: "blur" },
                ],
                userName: [
                    { required: true, message: "請輸入姓名", trigger: "blur" },
                ],
                // mobile: [{ required: true, message: '請輸入電話', trigger: 'blur' }],
                companyName: [
                    {
                        required: true,
                        message: "請輸入公司全稱",
                        trigger: "blur",
                    },
                ],
            },
            isRegisterSuccessShow: false,
            isRegisterLoading: false,
            timerCount: 0,
            timer: null
        };
    },
    computed: {},
    watch: {
        timerCount(newValue, oldValue) {
            if (newValue != oldValue && newValue == 0) {
                this.redirectLogin();
            }
        },
    },
    methods: {
        onRegister() {
            // console.log("使用者註冊時填入的資料為：", this.form);

            // let userData = [ ...this.$store.state.login.userData ]
            // userData = userData.filter(item => { return item.email == this.form.email && item.password == this.form.password });

            this.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    //alert('submit!');
                    this.$api.user.registerUser(this.form).then((res) => {
                        // console.log("註冊用戶返回的結果:", res);
                        if (res.code != 0)
                            return this.$message.error(
                                res.message || "註冊失敗！",
                                2
                            );
                        this.isRegisterSuccessShow = true;
                        this.resetForm();
                        this.countDown();
                    });
                    // this.$store.dispatch('user/addUserData',this.form).then(res => {
                    //     if (res) {
                    //     this.$message.success('新增成功！');
                    //     this.redirect()
                    //     }
                    // })
                    // console.log("userData",this.$store.state.login.userData)
                    // console.log("currentUser",this.$store.state.login.currentUser)
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        redirectLogin() {
            this.$router.push("/login");
        },
        redirect() {
            this.$router.push("/");
            //this.$router.push({'/main'})
        },
        resetForm() {
            this.$refs.ruleForm.resetFields();
        },
        countDown() {
            this.timerCount = 5;
            this.timer = window.setInterval(() => {
                this.timerCount--;
            }, 1000);
        },
        closeTimer() {
            clearInterval(this.timer);
            this.timer = null;
        },
    },
    deactivated() {
        clearInterval(this.timer);
        this.timer = null;
    },
    beforeDestroy() {
        clearInterval(this.timer);
        this.timer = null;
    },
};
</script>
