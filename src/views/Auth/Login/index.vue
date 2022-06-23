<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-08 22:20:57
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-25 15:22:20
-->
<template>
    <div class="AuthUI-card flex-column">
        <div class="AuthUI-card__title flex-center">登入</div>
        <div class="AuthUI-card__tips flex-center">請登入以後再繼續</div>

        <div class="AuthUI-card__tabs">
            <a-tabs default-active-key="1" @change="onClickTab">
                <a-tab-pane key="1" tab="帳號密碼">
                    <a-form-model
                        ref="loginForm"
                        :model="loginForm"
                        :rules="rules"
                    >
                        <a-form-model-item
                            ref="username"
                            prop="username"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="loginForm.username"
                                placeholder="請輸入登入用戶名"
                                @blur="
                                    () => {
                                        $refs.username.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="user" />
                            </a-input>
                        </a-form-model-item>

                        <a-form-model-item
                            ref="password"
                            prop="password"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input-password
                                v-model="loginForm.password"
                                placeholder="請輸入登入密碼"
                                @blur="
                                    () => {
                                        $refs.password.onFieldBlur();
                                    }
                                "
                                allow-clear
                            >
                                <a-icon slot="prefix" type="lock" />
                            </a-input-password>
                        </a-form-model-item>

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <div class="AuthUI-card__tabs--tips flex-between">
                                <!-- <div class="cursor-pointer">記住我</div> -->
                                <div></div>
                                <div
                                    class="cursor-pointer"
                                    @click="onForgetPassword"
                                >
                                    忘記密碼
                                </div>
                            </div>
                        </a-form-model-item>

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <myButton
                                class="AuthUI-btn--big"
                                theme="orange"
                                :isRound="true"
                                :text="isLoginLoading ? '登入中' : '登入'"
                                :loading="isLoginLoading"
                                @click="onSubmit"
                            />
                        </a-form-model-item>

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <div
                                class="AuthUI-btn--link flex-center cursor-pointer"
                                @click="onRegister"
                            >
                                {{ `免費注册帳號 >` }}
                            </div>
                        </a-form-model-item>
                    </a-form-model>
                </a-tab-pane>
            </a-tabs>
        </div>
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
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            other: "",
            loginForm: {
                username: process.env.NODE_ENV === 'development' ? "admin" : '', 
                password: process.env.NODE_ENV === 'development' ? "sdfdsfew342@" : '', 
            },
            rules: {
                username: [
                    {
                        required: true,
                        message: "請輸入登入用戶名",
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
                    {
                        required: true,
                        message: "請輸入登入密碼",
                        trigger: "blur",
                    },
                    {
                        min: 6,
                        max: 20,
                        message: "長度應介於6至20位之間",
                        trigger: "blur",
                    },
                ],
            },
            isLoggingIn: false,
            isAlertShow: false,
            redirect: undefined,
            otherQuery: {},
            isLoginLoading: false,
        };
    },
    created() {
        console.log("login created");
        sessionStorage.clear();
    },
    computed: {},
    watch: {
        $route: {
            handler: function (route) {
                const query = route.query;
                if (query) {
                    this.redirect = query.redirect;
                    this.otherQuery = this.getOtherQuery(query);
                }
            },
            immediate: true,
        },
    },
    mounted() {
       
    },
    methods: {
        onClickTab() {},
        onRegister() {
            this.$router.push("/register");
        },
        onSubmit() {
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    return this.login();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        login() {
            this.isLoginLoading = true;

            const { username, password } = this.loginForm;
            let formData = new FormData();
            formData.append("username", username.trim());
            formData.append("password", password);
            formData.append("grant_type", "password");
            formData.append("client_id", "client-pc");
            formData.append("client_secret", "123456");

            this.$api.user
                .login(formData, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencode",
                    },
                })
                .then((res) => {
                    if (res.code != 0)
                        return (
                            (this.isLoginLoading = false),
                            this.$message.error(res.message || "登入失敗！", 2)
                        );
                    const { data } = res;
                    let token = `${data.tokenHead}${data.token}`;
                    this.$store.commit("user/SET_TOKEN", token);
                    sessionStorage.setItem("x-auth-token", token);
                    this.queryUserInfo(); //獲取用戶信息
                    this.getUserMenu() //獲取菜單
                    // this.redirectMain();
                })
                .catch((error) => {
                    this.$message.error("登入失敗！", 2);
                    this.isLoginLoading = false
                });
        },
        queryUserInfo() {
            this.$store.dispatch("user/queryUserInfo").then((res) => {
                this.isLoginLoading = false;
                if (res) this.redirectMain();
            }).catch(err => {
                console.log('獲取使用者資訊失敗錯誤資訊: ', err);
                this.isLoginLoading = false;
            })
        },
        getUserMenu() {
			this.$store.dispatch('user/menuDatafetch').then(res => {
				//TODO
			})
		},
        redirectMain() {
            if (this.$route.query.redirect == location.hostname) {
                this.$router.go(-1);
            } else {
                this.$router.push("/persons");
            }
        },
        resetForm() {
            this.$refs.loginForm.resetFields();
        },
        onForgetPassword() {
            this.$router.push("/login/forget-password");
        },
        getOtherQuery(query) {
            return Object.keys(query).reduce((acc, cur) => {
                if (cur !== "redirect") {
                    acc[cur] = query[cur];
                }
                return acc;
            }, {});
        },
    },
};
</script>
