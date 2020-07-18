<template>
  <div class="container">

    <div>
      <h1>디스코드 유저 조회</h1>
    <h2>ID로 유저 프로필을 조회하세요.</h2>
    <div class="form">
      <input v-model="id"/><br/>
      <button v-on:click="submit"/>
    </div>
    <div class="user" v-if="user">
        <img v-bind:src="user.data.avatar" class="avatar"/>
      <h2>
        {{ user.data.username }}#{{ user.data.discriminator }} <span class="bot" v-if="user.data.bot"><verifiedbot v-if="user.data.badges.includes('VERIFIED_BOT')"/>BOT</span>
      </h2>
    </div>
    </div>
  </div>
  
</template>

<script>
export default {
  methods: {
    async submit(){
      if(this.id) {
        this.valid = SnowflakeUtil.deconstruct(this.id).timestamp !== 1420070400000
        this.user = await this.$axios.get(`/api/${this.id}`).then((res)=> {
          return res.data
        })
        .catch((e)=> { 
          return { code: 500, message: '알 수 없는 에러가 발생하였습니다.' }
        })
      }
      else this.valid = false
      console.log(this.id)
      console.log(this.valid)
    }
  },
  data: function(){
    return {
    id: '653534001742741552',
    valid: false,
    user: undefined
  }
  }
}

/**
 * Source From discordjs/discord.js
 */
const EPOCH = 1420070400000;
let INCREMENT = 0;

/**
 * A container for useful snowflake-related methods.
 */
class SnowflakeUtil {
  constructor() {
    throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
  }

  /**
   * A Twitter snowflake, except the epoch is 2015-01-01T00:00:00.000Z
   * ```
   * If we have a snowflake '266241948824764416' we can represent it as binary:
   *
   * 64                                          22     17     12          0
   *  000000111011000111100001101001000101000000  00001  00000  000000000000
   *       number of ms since Discord epoch       worker  pid    increment
   * ```
   * @typedef {string} Snowflake
   */

  /**
   * Generates a Discord snowflake.
   * <info>This hardcodes the worker ID as 1 and the process ID as 0.</info>
   * @param {number|Date} [timestamp=Date.now()] Timestamp or date of the snowflake to generate
   * @returns {Snowflake} The generated snowflake
   */
  static generate(timestamp = Date.now()) {
    if (timestamp instanceof Date) timestamp = timestamp.getTime();
    if (typeof timestamp !== 'number' || isNaN(timestamp)) {
      throw new TypeError(
        `"timestamp" argument must be a number (received ${isNaN(timestamp) ? 'NaN' : typeof timestamp})`,
      );
    }
    if (INCREMENT >= 4095) INCREMENT = 0;
    // eslint-disable-next-line max-len
    const BINARY = `${(timestamp - EPOCH).toString(2).padStart(42, '0')}0000100000${(INCREMENT++)
      .toString(2)
      .padStart(12, '0')}`;
    return this.binaryToID(BINARY);
  }

  /**
   * A deconstructed snowflake.
   * @typedef {Object} DeconstructedSnowflake
   * @property {number} timestamp Timestamp the snowflake was created
   * @property {Date} date Date the snowflake was created
   * @property {number} workerID Worker ID in the snowflake
   * @property {number} processID Process ID in the snowflake
   * @property {number} increment Increment in the snowflake
   * @property {string} binary Binary representation of the snowflake
   */

  /**
   * Deconstructs a Discord snowflake.
   * @param {Snowflake} snowflake Snowflake to deconstruct
   * @returns {DeconstructedSnowflake} Deconstructed snowflake
   */
  static deconstruct(snowflake) {
    const BINARY = this.idToBinary(snowflake)
      .toString(2)
      .padStart(64, '0');
    const res = {
      timestamp: parseInt(BINARY.substring(0, 42), 2) + EPOCH,
      workerID: parseInt(BINARY.substring(42, 47), 2),
      processID: parseInt(BINARY.substring(47, 52), 2),
      increment: parseInt(BINARY.substring(52, 64), 2),
      binary: BINARY,
    };
    Object.defineProperty(res, 'date', {
      get: function get() {
        return new Date(this.timestamp);
      },
      enumerable: true,
    });
    return res;
  }
  static binaryToID(num) {
    let dec = '';

    while (num.length > 50) {
      const high = parseInt(num.slice(0, -32), 2);
      const low = parseInt((high % 10).toString(2) + num.slice(-32), 2);

      dec = (low % 10).toString() + dec;
      num =
        Math.floor(high / 10).toString(2) +
        Math.floor(low / 10)
          .toString(2)
          .padStart(32, '0');
    }

    num = parseInt(num, 2);
    while (num > 0) {
      dec = (num % 10).toString() + dec;
      num = Math.floor(num / 10);
    }

    return dec;
  }
  static idToBinary(num) {
    let bin = '';
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
      bin = String(low & 1) + bin;
      low = Math.floor(low / 2);
      if (high > 0) {
        low += 5000000000 * (high % 2);
        high = Math.floor(high / 2);
      }
    }
    return bin;
  }
}

</script>

<style scoped>
  .container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.container > div {
  width: 100%;
}

h1, h2, h3, h4, h5, h6 {
  color: white;
  display: block;
  padding-bottom: 10px;
}

.user {
  width: calc(100% - 7em);
  height: 15em;
  background: #202225;
  display: block;
  padding: 30px;
  text-align: left;
  margin-right: 1em;
  margin-left: 1.57em;
}

.bot {
  height: 35px !important;
  padding: 0 7px;
  border-radius: 3px;
  background: #7289da;
  color: white;
  font-size: 1rem;
  margin-bottom: 10px;
}

.verified {
  height: 1em;
  width: 1em;
  font-size: 1em;
}

@media screen  and (min-width: 768px){
  .user {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: 10% 90%;
  }
}

.avatar {
  border-radius: 50%;
  grid-area: 10px;
  width: 128px;
}
</style>