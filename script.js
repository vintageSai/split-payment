"use strict";
// import("./jquery.js");

//custom event
let updateValueEvent = new Event("updateValue");

//eventsHandlers:
$(function () {
  $("#allCheck")
    .parent()
    .on("click", function () {
      $("#allCheck")[0].click();
    });

  $("#allCheckGroup")
    .parent()
    .on("click", function () {
      $("#allCheckGroup")[0].click();
    });

  $("#allCheck").on("change", function () {
    if (this.checked) {
      $(".checkMain>input").each(function () {
        $(this).prop("checked", true);
        $("#delBut").prop("hidden", false);
        $("#crtGrp").prop("hidden", false);
      });
    } else {
      $(".checkMain>input").each(function () {
        $(this).prop("checked", false);
        $("#delBut").prop("hidden", true);
        $("#crtGrp").prop("hidden", true);
      });
    }
  });

  $("#allCheckGroup").on("change", function () {
    if (this.checked) {
      $(".checkGroup>input").each(function () {
        $(this).prop("checked", true);
        $("#delGrpBut").prop("hidden", false);
      });
    } else {
      $(".checkGroup>input").each(function () {
        $(this).prop("checked", false);
        $("#delGrpBut").prop("hidden", true);
      });
    }
  });

  $("body").on("click", ".checkMain", function () {
    // console.log($(this).children()[0]);
    $(this).children()[0].click();
  });

  $("body").on("click", ".checkGroup", function () {
    $(this).children()[0].click();
  });

  //When Main checkbox is clicked
  $("body").on("click", ".checkMain>input", function () {
    if (!this.checked) {
      if (getMainCheckBoxCheckedCount() == 0) {
        $("#delBut").prop("hidden", true);
        $("#crtGrp").prop("hidden", true);
      }
      if (getMainCheckBoxCheckedCount() < $(".checkMain>input").length)
        $("#allCheck")[0].checked = false;
    } else {
      $("#delBut").prop("hidden", false);
      $("#crtGrp").prop("hidden", false);
      if (getMainCheckBoxCheckedCount() == $(".checkMain>input").length)
        $("#allCheck")[0].checked = true;
    }
  });

  //When Group checkbox is clicked
  $("body").on("click", ".checkGroup>input", function () {
    if (!this.checked) {
      if (getGroupCheckBoxCheckedCount() == 0)
        $("#delGrpBut").prop("hidden", true);
      if (getGroupCheckBoxCheckedCount() < $(".checkGroup>input").length)
        $("#allCheckGroup")[0].checked = false;
    } else {
      $("#delGrpBut").prop("hidden", false);
      if (getGroupCheckBoxCheckedCount() == $(".checkGroup>input").length)
        $("#allCheckGroup")[0].checked = true;
    }
  });

  let rowBgColor = null;
  //hover mouseEnter
  $("body").on("mouseenter", ".checkMain", function () {
    rowBgColor = $(this).parent().css("background-color");
    $(this).parent().css("background-color", "yellow");
  });

  //hover mouserLeave
  $("body").on("mouseleave", ".checkMain", function () {
    $(this).parent().css("background-color", rowBgColor);
  });

  //hover mouseEnter
  $("body").on("mouseenter", ".checkGroup", function () {
    rowBgColor = $(this).parent().css("background-color");
    $(this).parent().css("background-color", "yellow");
  });

  //hover mouserLeave
  $("body").on("mouseleave", ".checkGroup", function () {
    $(this).parent().css("background-color", rowBgColor);
  });

  $("body").on("click", ".nameMain", function () {
    promptMemberName($(this).parent().index(), $(this)[0].innerText);
  });

  $("body").on("click", ".paidMain", function () {
    promptMemberPayment($(this).parent().index(), $(this)[0].innerText);
  });

  $("body").on("click", ".nameGroup", function () {
    promptGroupName($(this).parent().index() - 1, $(this)[0].innerText);
  });

  $("body").on("click", ".expGroup", function () {
    promptGroupExpenditure($(this).parent().index() - 1, $(this)[0].innerText);
  });

  $("body").on("click", ".memGroup", function () {
    let index = $(this).parent().index() - 1;
    let groupName = $(".nameGroup")[index].innerText;
    displayModal(groupName);
    let existingMembers = getGroupNamesArrayFromString($(this)[0].innerText);
    // console.log(index, groupName);
    // console.log(getGroupNamesArrayFromString($(this)[0].innerText));
    let members = getAllMemberNames();
    for (let i = 0; i < members.length; i++) {
      if (existingMembers.includes(members[i]))
        createListGroupItem(i + 1, members[i], true);
      else createListGroupItem(i + 1, members[i], false);
    }
  });

  $("body").on("click", "#closeModal", function () {
    closeModal();
  });
  $("body").on("click", "#crossModal", function () {
    closeModal();
  });

  //custom updateValue event
  document.addEventListener("updateValue", function () {
    updateMainGroupExpenditure();
    updateNetPayables();
  });
});

//DOM functions **************************************************
function addRowToMainTable() {
  let name = getLastRowName_MainTable();
  if (name && name.trim() != "") {
    $("#mainTable>tbody").append(mainRowCells());
    // $("tbody>tr:last-of-type >td:nth-of-type(2)")[0].innerText = 0;
    let index = $(".nameMain").length - 1;
    promptMemberName(index);
    promptMemberPayment(index, 0);
  } else if ($(".nameMain").length == 0) {
    $("#mainTable>tbody").append(mainRowCells());
    promptMemberName(0);
    promptMemberPayment(0, 0);
  }
  document.dispatchEvent(updateValueEvent);
}

function getLastRowName_MainTable() {
  let lastEle = $("#mainTable tr:last>td ")[0];
  if (lastEle) return lastEle.innerText;
}

function mainRowCells() {
  return (
    "<tr>" +
    mainTable_NameCell() +
    mainTable_PaidCell() +
    mainTable_PayableCell() +
    mainTable_checkBox() +
    "</tr>"
  );
}

function mainTable_NameCell() {
  return "<td class='nameMain'></td>";
}

function mainTable_PaidCell() {
  return "<td class='paidMain'></td>";
}

function mainTable_PayableCell() {
  return "<td class='payableMain'></td>";
}

function mainTable_checkBox() {
  return "<td class='checkMain'><input type='checkbox' /></td>";
}

function getMainCheckBoxCheckedCount() {
  let count = 0;
  let ele = $(".checkMain>input");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) count++;
  }
  return count;
}

function getMainCheckedBoxesIndices() {
  let indices = [];
  let ele = $(".checkMain>input");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) indices.push(i);
  }
  return indices;
}

function getGroupCheckBoxCheckedCount() {
  let count = 0;
  let ele = $(".checkGroup>input");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) count++;
  }
  return count;
}

function promptMemberName(index, defName) {
  let name = prompt("Enter name of person", defName);
  if (name) name = name.trim().replace(/(\r\n|\n|\r)/gm, "");
  while (
    !name ||
    name.trim() == "" ||
    name.includes(",") ||
    doesMemberAlreadyExist(name, index)
  ) {
    if (!name || name.trim() == "" || name.includes(",")) {
      name = prompt("Enter valid person name", defName);
    } else {
      name = prompt(
        "Enter different name \nMentioned person already exists!!",
        defName
      );
    }
  }
  let modName = name.trim().replace(/(\r\n|\n|\r)/gm, "");
  $(".nameMain")[index].innerText = modName;
  if (defName && defName != "") {
    modifyMemberNameInAllGroups(defName, modName);
  }
}

function doesMemberAlreadyExist(name, index) {
  let ele = $(".nameMain");
  for (let i = 0; i < ele.length; i++) {
    if (i != index) {
      if (
        ele[i].innerText.toUpperCase() ==
        name
          .trim()
          .replace(/(\r\n|\n|\r)/gm, "")
          .toUpperCase()
      )
        return true;
    }
    if (i == ele.length - 1) return false;
  }
}

function promptMemberPayment(index, defPayment) {
  let member = $(".nameMain")[index].innerText;
  let payment = prompt("Enter payment done by " + member, defPayment);
  if (payment) payment = payment.trim().replace(/(\r\n|\n|\r)/gm, "");
  while (
    payment == null ||
    payment == undefined ||
    payment.trim() == "" ||
    isNaN(payment) ||
    Number(payment) < 0 ||
    !isMemberPaymentValid(Number(payment), member)
  ) {
    payment = prompt(
      "Enter valid amount for payment done by " + member,
      defPayment
    );
    payment = payment.trim().replace(/(\r\n|\n|\r)/gm, "");
  }
  $(".paidMain")[index].innerText = Number(
    payment.trim().replace(/(\r\n|\n|\r)/gm, "")
  );
  document.dispatchEvent(updateValueEvent);
}

function isMemberPaymentValid(amt, member) {
  if (amt != undefined && amt != null && !isNaN(amt)) {
    let members = $(".nameMain");
    let payments = $(".paidMain");
    let effTotalPayment = 0;
    for (let i = 0; i < members.length; i++) {
      if (members[i].innerText != member)
        effTotalPayment += getNumber(payments[i].innerText);
      else effTotalPayment += Number(amt);
    }
    return effTotalPayment - getGroupsTotalExpenditure() >= 0 ? true : false;
  }
  return false;
}

function deleteMainHighLightedRows() {
  if (canMembersBeDeleted()) deleteMainHighLightedRows_();
  else {
    alert(
      "Selected members cannot be deleted\nAdjust group expenditures before deleting"
    );
  }
}

function deleteMainHighLightedRows_() {
  let members = $(".nameMain");
  for (let i = 0; i < $(".checkMain>input").length; i++) {
    if ($(".checkMain>input")[i].checked) {
      deleteMemberInAllGroups(members[i].innerText);
      $("#mainTable")[0].deleteRow(i + 1);
    }
  }
  if (getMainCheckBoxCheckedCount() > 0) deleteMainHighLightedRows_();
  else uncheckAllMembers();

  document.dispatchEvent(updateValueEvent);
}

function groupTable_NameCell() {
  return "<td class='nameGroup'></td>";
}

function groupTable_ExpenditureCell() {
  return "<td class='expGroup'></td>";
}

function groupTable_MembersCell() {
  return "<td td class='memGroup'></td>";
}

function groupTable_checkBox() {
  return "<td class='checkGroup'><input type='checkbox' /></td>";
}

function groupRowCells() {
  return (
    "<tr>" +
    groupTable_NameCell() +
    groupTable_ExpenditureCell() +
    groupTable_MembersCell() +
    groupTable_checkBox() +
    "</tr>"
  );
}

function getLastRowName_GroupTable() {
  let lastEle = $(".nameGroup");
  let size = lastEle.length;
  if (size > 0) {
    return lastEle[size - 1].innerText;
  }
}

function addRowToGroupTable() {
  let name = getLastRowName_GroupTable();
  if (name && name.trim() != "") {
    $("#groupTable>tbody").append(groupRowCells());
    let index = $(".nameGroup").length - 1;
    promptGroupName(index);
    promptGroupExpenditure(index, 0);
    $(".memGroup")[index].innerText =
      getMainHighlightedRowsNamesArr().join(", ");
  } else if ($(".nameGroup").length == 0) {
    $("#groupTable>tbody").append(groupRowCells());
    promptGroupName(0);
    promptGroupExpenditure(0, 0);
    $(".memGroup")[0].innerText = getMainHighlightedRowsNamesArr().join(", ");
  }
  uncheckAllMembers();
  document.dispatchEvent(updateValueEvent);
}

function promptGroupName(index, defName) {
  let name = prompt("Enter group name", defName);
  if (name) name = name.trim().replace(/(\r\n|\n|\r)/gm, "");
  while (!name || name.trim() == "" || doesGroupAlreadyExist(name, index)) {
    if (!name || name == "") {
      name = prompt("Enter valid group name", defName);
    } else {
      name = prompt(
        "Enter different group name \nMentioned group already exists!!",
        defName
      );
    }
  }
  $(".nameGroup")[index].innerText = name.trim().replace(/(\r\n|\n|\r)/gm, "");
}

function doesGroupAlreadyExist(name, index) {
  let ele = $(".nameGroup");
  for (let i = 0; i < ele.length; i++) {
    if (i != index) {
      if (
        ele[i].innerText.toUpperCase() ==
        name
          .trim()
          .replace(/(\r\n|\n|\r)/gm, "")
          .toUpperCase()
      )
        return true;
    }
    if (i == ele.length - 1) return false;
  }
}

function deleteMemberInAllGroups(member) {
  if (member) {
    let groupNames = $(".nameGroup");
    let memGroups = $(".memGroup");
    let members = [],
      group;
    for (let i = 0; i < groupNames.length; i++) {
      group = groupNames[i].innerText;
      members = getMembersOfGroup(group);
      if (members.includes(member)) {
        if (isMemberOnlyPersonOfGroup(member, group)) setGroupExpenditure(i, 0);
        //remove member from the group
        members.splice(members.indexOf(member), 1);
        memGroups[i].innerText = members.join(", ");
      }
    }
  }
}

function modifyMemberNameInAllGroups(oldName, newName) {
  if (oldName && newName) {
    let groupNames = $(".nameGroup");
    let memGroups = $(".memGroup");
    let members = [],
      group;
    for (let i = 0; i < groupNames.length; i++) {
      group = groupNames[i].innerText;
      members = getMembersOfGroup(group);
      if (members.includes(oldName)) {
        //modify Name
        members.splice(members.indexOf(oldName), 1, newName);
        memGroups[i].innerText = members.join(", ");
      }
    }
  }
}

function canMembersBeDeleted() {
  //Check is it possible to delete all the highlighted members and still keep the
  //difference of TotalPayment - GroupExpenditure >= 0
  //Here Total payment should be recalculated for checking purpose
  //And Group expenditure should be recalculated by removing the members temporarily from the
  //groups and check for any isolated groups(Groups which become memberless after removal)

  //Get effective total payment excluding selected members
  let effTotalPayment = 0;
  let all_members = getAllMemberNames();
  let selected_members = getMainHighlightedRowsNamesArr();
  let memberPaymentEle = $(".paidMain");
  for (let i = 0; i < all_members.length; i++) {
    if (!selected_members.includes(all_members[i]))
      effTotalPayment += getNumber(memberPaymentEle[i].innerText);
  }
  // console.log("Effective Total Payment", effTotalPayment);

  //Get Group status after removal
  let effGroupTotalExp = 0;
  let groups = $(".memGroup");
  let groupsExp = $(".expGroup");
  let groupMembers = [];
  for (let i = 0; i < groups.length; i++) {
    groupMembers = groups[i].innerText.split(", ");
    groupMembers = groupMembers.filter((m) => !selected_members.includes(m));
    if (groupMembers.length > 0) {
      effGroupTotalExp += getNumber(groupsExp[i].innerText);
    }
  }
  // console.log("Effective Total Group Expenditure", effGroupTotalExp);
  // console.log("Effective Difference", effTotalPayment - effGroupTotalExp);
  if (effTotalPayment - effGroupTotalExp >= 0) return true;
  return false;
}

function getNumber(str) {
  if (str) {
    if (!isNaN(str)) return Number(str);
  }
  return 0;
}

function uncheckAllMembers() {
  let maincheck = $("#allCheck");
  maincheck[0].checked = false;
  let checkEle = $(".checkMain");
  for (let i = 0; i < checkEle.length; i++) {
    checkEle[i].children[0].checked = false;
  }
  $("#delBut").prop("hidden", true);
  $("#crtGrp").prop("hidden", true);
}

function getMembersOfGroup(groupName) {
  if (groupName) {
    let groupNames = $(".nameGroup");
    let memGroups = $(".memGroup");
    for (let i = 0; i < groupNames.length; i++) {
      if (groupNames[i].innerText == groupName) {
        return memGroups[i].innerText.split(", ");
      }
    }
  }
}

function promptGroupExpenditure(index, defPayment) {
  let group = $(".nameGroup")[index].innerText;
  let expenditure = prompt("Enter expenditure of " + group, defPayment);
  if (expenditure)
    expenditure = expenditure.trim().replace(/(\r\n|\n|\r)/gm, "");
  while (
    !expenditure ||
    expenditure.trim() == "" ||
    isNaN(expenditure) ||
    Number(expenditure) < 0 ||
    Number(expenditure) > getMaxPossibleExpenditure(index)
  ) {
    expenditure = prompt(
      "Enter valid amount for expenditure of " + group,
      defPayment
    );
  }
  $(".expGroup")[index].innerText = Number(
    expenditure.trim().replace(/(\r\n|\n|\r)/gm, "")
  );
  document.dispatchEvent(updateValueEvent);
}

function getMaxPossibleExpenditure(index) {
  if ($(".expGroup")[index].innerText) {
    return (
      getTotalPaymentDone() +
      Number($(".expGroup")[index].innerText) -
      getGroupsTotalExpenditure()
    );
  }
  return getTotalPaymentDone() - getGroupsTotalExpenditure();
}

function deleteGroupHighLightedRows() {
  for (let i = 0; i < $(".checkGroup>input").length; i++) {
    if ($(".checkGroup>input")[i].checked) $("#groupTable")[0].deleteRow(i + 2);
  }
  if (getGroupCheckBoxCheckedCount() > 0) deleteGroupHighLightedRows();
  document.dispatchEvent(updateValueEvent);
}

function getMainHighlightedRowsNamesArr() {
  let ele = $(".nameMain");
  let checkEle = $(".checkMain>input");
  let arr = [];
  for (let i = 0; i < ele.length; i++) {
    if (checkEle[i].checked) arr.push(ele[i].innerText);
  }
  // console.log(arr.join(", ").split(", "));
  return arr;
}

function createListGroupItem(id, member, checkedStatus) {
  if (id && member) {
    let checked_ = checkedStatus == true ? "checked" : "";
    let listItem =
      '<li class="list-group-item">' +
      '<div class="custom-control custom-checkbox">' +
      `<input type="checkbox" class="custom-control-input" id="check_${id}" ${checked_}>` +
      `<label class="custom-control-label" for="check_${id}">${member}</label>` +
      "</div></li>";
    $("#myModal").find("ul").append(listItem);
  }
}

function saveModal() {
  let ele = $("#myModal").find("li.list-group-item");
  let chk = ele.find("input");
  let lbl = ele.find("label");
  let updatedMembers = [];
  // $("#myModal").modal("hide");
  for (let i = 0; i < ele.length; i++) {
    if (chk[i].checked) {
      updatedMembers.push(lbl[i].innerText);
    }
  }
  let groupName = $("#modGroupHeading")[0].innerText;
  if (groupName) {
    let grpNames = $(".nameGroup");
    for (let i = 0; i < grpNames.length; i++) {
      if (grpNames[i].innerText == groupName) {
        $(".memGroup")[i].innerText = updatedMembers.join(", ");
        if (updatedMembers.length == 0) setGroupExpenditure(i, 0);
        break;
      }
    }
  }
  document.dispatchEvent(updateValueEvent);
}

// For displaying modal
function displayModal(groupName) {
  $(function () {
    if (groupName) $("#modGroupHeading")[0].innerText = groupName;
    $("#myModal").modal("show");
  });
}

function closeModal() {
  $("#myModal").modal("hide");
  $("#myModal").find("ul")[0].innerText = "";
  $("#modGroupHeading")[0].innerText = "";
}

function getAllMemberNames() {
  let arr = [];
  $(".nameMain").each(function () {
    arr.push($(this)[0].innerText);
  });
  return arr;
}

function isMemberOnlyPersonOfGroup(member, group) {
  if (member && group) {
    let members = getMembersOfGroup(group);
    if (members.includes(member) && members.length == 1) {
      return true;
    }
    return false;
  }
  return false;
}

function updateNetPayables() {
  let members = getAllMemberNames();
  let payableEle = $(".payableMain");
  let num = 0;
  for (let i = 0; i < members.length; i++) {
    num = getNetPayable(members[i]).toFixed(2);
    if (num % 1 == 0) payableEle[i].innerText = parseInt(num);
    else payableEle[i].innerText = num;
  }
}

//Functionalities**********************************

function getTotalPaymentDone() {
  let total = 0;
  $(".paidMain").each(function () {
    let amt = $(this)[0].innerText;
    if (!isNaN(amt)) total += Number(amt);
  });
  return total;
}

function getGroupsTotalExpenditure() {
  let total = 0;
  $(".expGroup").each(function () {
    let amt = $(this)[0].innerText;
    if (!isNaN(amt)) total += Number(amt);
  });
  return total;
}

function updateMainGroupExpenditure() {
  $("#mainGroupExpenditure")[0].innerText =
    getTotalPaymentDone() - getGroupsTotalExpenditure();
}

function setGroupExpenditure(index, expenditure) {
  $(".expGroup")[index].innerText = expenditure;
  document.dispatchEvent(updateValueEvent);
}

function getGroupNamesArrayFromString(str) {
  if (str) {
    return str.split(", ");
  }
  return [];
}

function getNetPayable(member) {
  let membersCount = $(".nameMain").length;
  let totalPayment = getTotalPaymentDone();
  let mainGroupExp = totalPayment - getGroupsTotalExpenditure();
  let mainGroupSplit = mainGroupExp / membersCount;
  let groupSplit = 0;
  let groupsEle = $(".memGroup"),
    groupsExpEle = $(".expGroup");
  let groupMem = undefined;
  for (let i = 0; i < groupsEle.length; i++) {
    groupMem = groupsEle[i].innerText.split(", ");
    if (groupMem.includes(member)) {
      groupSplit += getNumber(groupsExpEle[i].innerText) / groupMem.length;
    }
  }
  let grossTotal = mainGroupSplit + groupSplit;
  // console.log("Main Group Split", mainGroupSplit);
  // console.log("Groups Split", groupSplit);
  // console.log("Gross Total", grossTotal);

  let index = Array.from($(".nameMain"))
    .map((e) => e.innerText)
    .indexOf(member);
  let memberPayment = getNumber($(".paidMain")[index].innerText);
  return mainGroupSplit + groupSplit - memberPayment;
}
