<!--
 * @Descripttion: 
 * @version: 
 * @Author: Lone
 * @Date: 2022-01-08 22:20:57
 * @LastEditors: Lone
 * @LastEditTime: 2022-04-25 15:22:10
-->
<template>
    <div class="AuthUI-card flex-column">
        <div class="AuthUI-card__title flex-center">找回密碼</div>
        <div class="AuthUI-card__tips flex-center">找回密碼以重新登入</div>

        <div class="AuthUI-card__tabs">
            <a-tabs default-active-key="1" @change="onClickTab">
                <a-tab-pane key="1" tab="郵箱方式">
                    <a-form-model ref="form" :model="form" :rules="rules">
                        <a-form-model-item
                            ref="email"
                            prop="email"
                            label="請輸入帳號綁定郵箱"
                            class="AuthUI-card__tabs--line"
                        >
                            <a-input
                                v-model="form.email"
                                placeholder="請輸入帳號綁定郵箱"
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

                        <a-form-model-item class="AuthUI-card__tabs--line">
                            <myButton
                                class="AuthUI-btn--big"
                                theme="orange"
                                :isRound="true"
                                text="申請重設密碼"
                                @click="onSubmit"
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
            form: {
                email: "",
                // password: "123456",
            },
            rules: {
                email: [
                    {
                        required: true,
                        message: "請輸入帳號綁定郵箱",
                        trigger: "blur",
                    },
                    {
                        min: 3,
                        max: 20,
                        message: "長度應介於3至20",
                        trigger: "blur",
                    },
                ],
                // password: [
                //     {
                //         required: true,
                //         message: "Please input password form",
                //         trigger: "blur",
                //     },
                // ],
            },
            isLoggingIn: false,
            isAlertShow: false,
            redirect: undefined,
            otherQuery: {},
            isLoginLoading: false,
        };
    },
    created() {},
    computed: {},
    mounted() {},
    methods: {
        onClickTab() {},
        redirectLogin() {
            this.$router.push("/login");
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    return this.onResetPassword();
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },
        onResetPassword() {
            console.log('點擊了重設密碼');
        }
    },
};
</script>
