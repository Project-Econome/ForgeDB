"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const forgescript_1 = require("@tryforge/forgescript");
const database_1 = require("../../database");
exports.default = new forgescript_1.NativeFunction({
    name: "$memberCooldown",
    version: "2.0.0",
    description: "Adds a cooldown to a command for a member",
    brackets: true,
    unwrap: false,
    args: [
        {
            name: "duration",
            description: "The duration of the cooldown",
            rest: false,
            type: forgescript_1.ArgType.Time,
            required: true,
        },
        {
            name: "code",
            description: "The code to execute if the cooldown is active",
            rest: false,
            type: forgescript_1.ArgType.String,
        }, {
            name: "guild ID",
            description: "The guild id where the member belongs to",
            rest: false,
            type: forgescript_1.ArgType.Guild,
            required: false
        }, {
            name: "member ID",
            description: "The member id of the variable",
            rest: false,
            type: forgescript_1.ArgType.User,
            required: false,
        }
    ],
    async execute(ctx) {
        const [, code] = this.data.fields;
        const dur = await this["resolveUnhandledArg"](ctx, 0);
        if (!this["isValidReturnType"](dur))
            return dur;
        const idV = await this["resolveUnhandledArg"](ctx, 3);
        if (!this["isValidReturnType"](idV))
            return idV;
        const guildV = await this["resolveUnhandledArg"](ctx, 2);
        if (!this["isValidReturnType"](idV))
            return guildV;
        const cooldown = await database_1.DataBase.cdTimeLeft(`${ctx.cmd?.name}_${guildV?.value?.id ?? ctx.guild?.id}_${idV.value?.id ?? ctx.user?.id}_member`);
        if (cooldown !== 0) {
            const content = await this["resolveCode"](ctx, code);
            if (!this["isValidReturnType"](content))
                return content;
            ctx.container.content = content.value;
            await ctx.container.send(ctx.obj);
            return this.stop();
        }
        await database_1.DataBase.cdAdd({ id: `${ctx.cmd?.name}_${guildV?.value?.id ?? ctx.guild?.id}_${idV.value?.id ?? ctx.user?.id}_member`, duration: dur.value });
        return this.success();
    },
});
//# sourceMappingURL=memberCooldown.js.map