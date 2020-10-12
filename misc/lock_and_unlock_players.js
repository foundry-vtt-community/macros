async function updateRoles(from, to) {
    game.users.entities.filter(u => u.role === from).forEach(u => u.update({role:to}))
}
new Dialog({
    title: `Lock or unlock all players?`,
    default: 'cancel',
    buttons: {
        unlock: {
            icon: '<i class="fas fa-unlock"></i>',
            label: 'Unlock',
            callback: () => updateRoles(CONST.USER_ROLES.NONE, CONST.USER_ROLES.PLAYER)
        },
        lock: {
            icon: '<i class="fas fa-lock"></i>',
            label: 'Lock',
            callback: () => updateRoles(CONST.USER_ROLES.PLAYER, CONST.USER_ROLES.NONE)
        },
        cancel: {
            icon: '<i class="fas fa-eject"></i>',
            label: 'Cancel',
            callback: () => {}
        }
    }
}).render(true)
