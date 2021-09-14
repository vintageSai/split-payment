"use strict";

var members = new Map(),
  groups = new Map();

var Member = {
  name: null,
  payment: 0,
};

var Group = {
  name: null,
  members: null,
  consumedTotal: 0,
  splitPerPerson_Amount: function () {
    if (this.members && this.members.length > 0)
      return this.consumedTotal / this.members.length;
    return 0;
  },
};

function createMember(name) {
  let obj = Object.create(Member);
  obj.name = name;
  return obj;
}

function addGroup(name, members) {
  if (!groups.get(name)) {
    let grp = Object.create(Group);
    grp.name = name;
    grp.members = members;
    groups.set(name, grp);
    return grp;
  }
}

function addMemberToGroup(groupName, memberName) {
  let mem = groups.get(groupName).members;
  if (!mem.includes(memberName)) mem.push(memberName);
}

function removeMemberFromGroup(groupName, memberName) {
  let grp = groups.get(groupName);
  //Removing from members
  let mem = grp.members;
  for (let i = 0; i < mem.length; i++) {
    if (mem[i].valueOf() == memberName.valueOf()) {
      mem.splice(i, 1);
    }
  }
}

function setConsumedTotalForGroup(groupName, amount) {
  groups.get(groupName).consumedTotal = amount;
}

function addConsumedTotalForGroup(groupName, amount) {
  groups.get(groupName).consumedTotal += amount;
}

function getMem(name) {
  return members.get(name);
}

let addMember = function (name) {
  if (!members.get(name)) members.set(name, createMember(name));
};

let pay = function (payer, amount) {
  getMem(payer).payment += amount;
};

let grossTotalPayment = function () {
  let total = 0;
  for (let member of members.values()) {
    total += member.payment;
  }
  return total;
};

let totalPaymentToMainGroup = function () {
  let groupTotal = 0;
  for (const group of groups.values()) {
    groupTotal += group.consumedTotal;
  }
  return grossTotalPayment() - groupTotal;
};

let splitPerPersonMainGroup = function () {
  return totalPaymentToMainGroup() / members.size;
};

const emptyGroupObject = Object.create(Group);

//get total of splits from all groups for a person
let getTotalOfGroupSplits = function (member) {
  let arr = Array.from(groups.values()).filter((m) =>
    m.members.includes(member)
  );

  if (arr.length > 0) {
    return arr.reduce(
      (prev, curr) =>
        prev.splitPerPerson_Amount() + curr.splitPerPerson_Amount(),
      emptyGroupObject
    );
  }
  return 0;
};

//splitPerPersonMainGroup + [splitperPersonOtherGroups]
let grossPayables = function () {
  let gPayables = new Map();
  for (let member of members.keys()) {
    gPayables.set(
      member,
      splitPerPersonMainGroup() + getTotalOfGroupSplits(member)
    );
  }
  return gPayables;
};

let netPayables = function () {
  let netPayables = new Map();
  for (let member of members.keys()) {
    netPayables.set(
      member,
      splitPerPersonMainGroup() +
        getTotalOfGroupSplits(member) -
        getMem(member).payment
    );
  }
  return netPayables;
};

console.log("\n\n********************START********************");
addMember("Sai");
addMember("Prakash");
addMember("Jeppu");
addMember("Sai");
addMember("JSP");

let g1 = addGroup("Grp 1", ["JSP", "Prakash"]);
g1.consumedTotal = 800;
console.log(g1);

pay("Sai", 500);
pay("Sai", 300);
pay("JSP", 1000);

// addMember("Puts");
// addMember("Nia");
// addMember("Tansi");
// addMember("Safina");

// pay("Nia", 100);
// pay("Puts", 300);
// pay("Safina", 40);

console.log(members);
console.log("Gross Total Payment : ", grossTotalPayment());
console.log("Total Payment to Main Group : ", totalPaymentToMainGroup());
console.log("Split per Person Main Group: ", splitPerPersonMainGroup());
console.log("Gross Payables", grossPayables());
console.log("Net Payables", netPayables());
