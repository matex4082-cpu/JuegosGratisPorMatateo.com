<script>
    document.addEventListener('DOMContentLoaded', () => {
        const floatingBtn = document.getElementById('floatingAdminBtn');
        const adminModal = document.getElementById('adminPanelModal');
        const closeAdminModal = document.getElementById('closeAdminModal');
        
        // 🛠️ CONTENEDOR ROBUSTO: Busca por clase, por ID o crea uno de respaldo si no existe
        let gameGrid = document.querySelector('.game-grid') || document.querySelector('.games-grid') || document.getElementById('gameGrid');
        if (!gameGrid) {
            // Si tu página usa otra clase, ponla aquí o creamos un contenedor automático al final del body
            gameGrid = document.createElement('div');
            gameGrid.className = 'game-grid';
            gameGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 20px;";
            document.body.appendChild(gameGrid);
        }

        const dynamicModal = document.getElementById('dynamicCollectionModal');
        const closeDynamicModal = document.getElementById('closeDynamicModal');
        const closeDynBtn = document.getElementById('closeDynBtn');
        const dynModalTitle = document.getElementById('dynModalTitle');
        const dynModalButtonsList = document.getElementById('dynModalButtonsList');

        const tabGamesBtn = document.getElementById('tabGamesBtn');
        const tabCollectionsBtn = document.getElementById('tabCollectionsBtn');
        const sectionGames = document.getElementById('sectionGames');
        const sectionCollections = document.getElementById('sectionCollections');

        const quickAddForm = document.getElementById('quickAddForm');
        const adminGamesList = document.getElementById('adminGamesList');
        const editIndexInput = document.getElementById('editIndex');
        const formSectionTitle = document.getElementById('formSectionTitle');
        const saveGameBtn = document.getElementById('saveGameBtn');
        const cancelEditBtn = document.getElementById('cancelEditBtn');

        const collectionForm = document.getElementById('collectionForm');
        const adminCollectionsList = document.getElementById('adminCollectionsList');
        const editColIndexInput = document.getElementById('editColIndex');
        const formColTitle = document.getElementById('formColTitle');
        const saveColBtn = document.getElementById('saveColBtn');
        const cancelColEditBtn = document.getElementById('cancelColEditBtn');

        let currentCollectionSubgames = [];
        const collectionSubgamesContainer = document.getElementById('collectionSubgamesContainer');
        const newSubgameTitle = document.getElementById('newSubgameTitle');
        const newSubgameLink = document.getElementById('newSubgameLink');
        const addSubgameBtn = document.getElementById('addSubgameBtn');

        let currentCustomButtons = [];
        const customButtonsContainer = document.getElementById('customButtonsContainer');
        const addCustomBtnField = document.getElementById('addCustomBtnField');

        const qaImgInput = document.getElementById('qaImg');
        const colMainImgInput = document.getElementById('colMainImg');

        const PASSWORD = "xd";

        function setupImageDropAndPaste(inputElement) {
            if (!inputElement) return;

            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                inputElement.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                inputElement.addEventListener(eventName, () => {
                    inputElement.style.borderColor = '#00b4d8';
                    inputElement.style.background = '#2a2a35';
                }, false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                inputElement.addEventListener(eventName, () => {
                    inputElement.style.borderColor = '#323238';
                    inputElement.style.background = '#202024';
                }, false);
            });

            inputElement.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                    handleImageFile(files[0], inputElement);
                }
            });

            inputElement.addEventListener('paste', (e) => {
                const items = (e.clipboardData || e.originalEvent.clipboardData).items;
                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf('image') !== -1) {
                        const blob = items[i].getAsFile();
                        handleImageFile(blob, inputElement);
                        e.preventDefault();
                        break;
                    }
                }
            });
        }

        function handleImageFile(file, targetInput) {
            if (!file.type.startsWith('image/')) {
                alert("Por favor, usa un archivo de imagen válido.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                targetInput.value = event.target.result;
                targetInput.dispatchEvent(new Event('change'));
                
                const originalBorder = targetInput.style.borderColor;
                targetInput.style.borderColor = '#38b000';
                setTimeout(() => {
                    targetInput.style.borderColor = originalBorder;
                }, 1000);
            };
            reader.readAsDataURL(file);
        }

        setupImageDropAndPaste(qaImgInput);
        setupImageDropAndPaste(colMainImgInput);

        function renderCustomButtonsFormList() {
            customButtonsContainer.innerHTML = '';
            if (currentCustomButtons.length === 0) {
                customButtonsContainer.innerHTML = '<p style="color: #777; font-size: 0.8rem; text-align: center;">No hay botones custom añadidos.</p>';
                return;
            }

            currentCustomButtons.forEach((btnData, idx) => {
                const wrapper = document.createElement('div');
                wrapper.style.cssText = "background: #202024; padding: 8px; border-radius: 6px; border: 1px solid #323238; display: flex; flex-direction: column; gap: 6px; position: relative;";
                
                wrapper.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.8rem; color: #ffb703; font-weight: bold;">Botón #${idx + 1}</span>
                        <button type="button" data-cindex="${idx}" class="remove-custom-btn-field" style="background: #e63946; color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                    </div>
                    <input type="text" data-cindex="${idx}" data-field="text" value="${btnData.text || ''}" placeholder="Texto del botón (ej: Ver Tráiler)" class="custom-input-text" style="padding: 5px; background: #121214; border: 1px solid #323238; color: #fff; border-radius: 4px; outline: none; font-size: 0.8rem;">
                    <input type="text" data-cindex="${idx}" data-field="link" value="${btnData.link || ''}" placeholder="Enlace del botón" class="custom-input-link" style="padding: 5px; background: #121214; border: 1px solid #323238; color: #fff; border-radius: 4px; outline: none; font-size: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #aaa;">
                        Color: <input type="color" data-cindex="${idx}" data-field="color" value="${btnData.color || '#ff7700'}" class="custom-input-color" style="width: 35px; height: 22px; border: none; border-radius: 4px; cursor: pointer; background: none;">
                    </div>
                `;
                customButtonsContainer.appendChild(wrapper);
            });

            document.querySelectorAll('.remove-custom-btn-field').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cIdx = parseInt(e.target.getAttribute('data-cindex'));
                    currentCustomButtons.splice(cIdx, 1);
                    renderCustomButtonsFormList();
                });
            });

            document.querySelectorAll('.custom-input-text, .custom-input-link, .custom-input-color').forEach(input => {
                input.addEventListener('input', (e) => {
                    const cIdx = parseInt(e.target.getAttribute('data-cindex'));
                    const field = e.target.getAttribute('data-field');
                    currentCustomButtons[cIdx][field] = e.target.value;
                });
            });
        }

        addCustomBtnField.addEventListener('click', () => {
            currentCustomButtons.push({ text: '', link: '', color: '#ff7700' });
            renderCustomButtonsFormList();
        });

        tabGamesBtn.addEventListener('click', () => {
            tabGamesBtn.style.background = '#7209b7';
            tabGamesBtn.style.color = 'white';
            tabGamesBtn.style.border = 'none';
            tabCollectionsBtn.style.background = '#121214';
            tabCollectionsBtn.style.color = '#aaa';
            tabCollectionsBtn.style.border = '1px solid #323238';
            sectionGames.style.display = 'block';
            sectionCollections.style.display = 'none';
        });

        tabCollectionsBtn.addEventListener('click', () => {
            tabCollectionsBtn.style.background = '#7209b7';
            tabCollectionsBtn.style.color = 'white';
            tabCollectionsBtn.style.border = 'none';
            tabGamesBtn.style.background = '#121214';
            tabGamesBtn.style.color = '#aaa';
            tabGamesBtn.style.border = '1px solid #323238';
            sectionCollections.style.display = 'block';
            sectionGames.style.display = 'none';
            renderAdminCollections();
        });

        function renderSubgamesFormList() {
            collectionSubgamesContainer.innerHTML = '';
            if (currentCollectionSubgames.length === 0) {
                collectionSubgamesContainer.innerHTML = '<p style="color: #777; font-size: 0.8rem; text-align: center;">No hay juegos añadidos a esta colección aún.</p>';
                return;
            }
            currentCollectionSubgames.forEach((sub, idx) => {
                const row = document.createElement('div');
                row.style.cssText = "display: flex; justify-content: space-between; align-items: center; background: #202024; padding: 6px 8px; border-radius: 4px; font-size: 0.85rem;";
                row.innerHTML = `
                    <span style="color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px;">🎮 ${sub.title}</span>
                    <button type="button" data-subindex="${idx}" class="remove-subgame-btn" style="background: #e63946; color: white; border: none; width: 22px; height: 22px; border-radius: 4px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center;">-</button>
                `;
                collectionSubgamesContainer.appendChild(row);
            });

            document.querySelectorAll('.remove-subgame-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const sIdx = parseInt(e.target.getAttribute('data-subindex'));
                    currentCollectionSubgames.splice(sIdx, 1);
                    renderSubgamesFormList();
                });
            });
        }

        addSubgameBtn.addEventListener('click', () => {
            const titleVal = newSubgameTitle.value.trim();
            const linkVal = newSubgameLink.value.trim();
            if (!titleVal) {
                alert("Escribe el nombre del juego.");
                return;
            }
            currentCollectionSubgames.push({ title: titleVal, link: linkVal });
            newSubgameTitle.value = '';
            newSubgameLink.value = '';
            renderSubgamesFormList();
        });

        function renderAllContentOnGrid() {
            if (!gameGrid) return;
            
            document.querySelectorAll('.custom-game-card, .custom-collection-card').forEach(card => card.remove());
            
            let collections = JSON.parse(localStorage.getItem('matateo_collections_single_img') || '[]');
            collections.forEach((col, cIdx) => {
                const card = document.createElement('div');
                card.className = 'game-card custom-collection-card';
                card.style.cssText = "background-color: #18181c; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #323238; box-shadow: 0 4px 12px rgba(0,0,0,0.5);";

                let namesListText = col.subgames.map(s => s.title).join(', ');
                if (namesListText.length > 50) namesListText = namesListText.substring(0, 47) + '...';

                card.innerHTML = `
                    <div style="width: 100%; height: 160px; background: #000;">
                        <img src="${col.mainImg}" alt="${col.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="padding: 20px; display: flex; flex-direction: column; gap: 10px; flex: 1;">
                        <h3 style="color: #fff; font-size: 1.3rem; margin: 0; font-weight: bold;">${col.title}</h3>
                        <div style="display: flex; flex-direction: column; gap: 5px; font-size: 0.85rem; color: #bbb;">
                            <p style="margin: 0;">📦 Incluye: ${namesListText || 'Sin juegos'}</p>
                            <p style="margin: 0;">🎮 Género: ${col.genre}</p>
                        </div>
                        <div style="margin-top: auto; padding-top: 10px;">
                            <button type="button" data-colindex="${cIdx}" class="open-col-modal-btn" style="width: 100%; background-color: #ff7700; color: white; padding: 12px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center;">📁 Ver Juegos Disponibles</button>
                        </div>
                    </div>
                `;
                gameGrid.appendChild(card);
            });

            document.querySelectorAll('.open-col-modal-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const cIdx = parseInt(e.target.getAttribute('data-colindex'));
                    const col = collections[cIdx];
                    
                    dynModalTitle.textContent = col.title;
                    dynModalButtonsList.innerHTML = '';

                    if (col.subgames.length === 0) {
                        dynModalButtonsList.innerHTML = '<p style="color: #888;">No hay juegos en esta colección.</p>';
                    } else {
                        col.subgames.forEach(sub => {
                            const linkTag = document.createElement('a');
                            linkTag.href = sub.link || '#';
                            linkTag.target = '_blank';
                            linkTag.rel = 'noopener noreferrer';
                            linkTag.textContent = sub.title;
                            linkTag.style.cssText = "display: block; background-color: #00b4d8; color: #fff; padding: 12px; border-radius: 8px; text-decoration: none; font-weight: bold; text-align: center; transition: background 0.2s;";
                            linkTag.onmouseover = () => linkTag.style.background = '#0096b4';
                            linkTag.onmouseout = () => linkTag.style.background = '#00b4d8';
                            dynModalButtonsList.appendChild(linkTag);
                        });
                    }

                    dynamicModal.style.display = 'flex';
                });
            });

            let customGames = JSON.parse(localStorage.getItem('matateo_custom_games') || '[]');
            customGames.forEach(game => {
                const card = document.createElement('div');
                card.className = 'game-card custom-game-card';
                card.style.cssText = "background-color: #18181c; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid #323238; box-shadow: 0 4px 12px rgba(0,0,0,0.5); padding: 15px; color: #fff; gap: 10px;";
                
                let detailsHTML = '';
                let buttonsHTML = '';

                if (game.hasPc && game.linkPc) {
                    detailsHTML += `<p style="margin: 0; font-size: 0.85rem; color: #aaa;">📦 Peso PC: ${game.weightPc || ''}</p>`;
                    buttonsHTML += `<a href="${game.linkPc}" target="_blank" rel="noopener noreferrer" style="display: block; background: #00b4d8; color: #fff; padding: 8px; border-radius: 6px; text-decoration: none; text-align: center; font-weight: bold; font-size: 0.9rem;">💻 Descargar para PC</a>`;
                }
                if (game.hasAndroid && game.linkAndroid) {
                    detailsHTML += `<p style="margin: 0; font-size: 0.85rem; color: #aaa;">📦 Peso Android: ${game.weightAndroid || ''}</p>`;
                    buttonsHTML += `<a href="${game.linkAndroid}" target="_blank" rel="noopener noreferrer" style="display: block; background: #38b000; color: #fff; padding: 8px; border-radius: 6px; text-decoration: none; text-align: center; font-weight: bold; font-size: 0.9rem;">📱 Descargar para Android</a>`;
                }
                
                detailsHTML += `<p style="margin: 0; font-size: 0.85rem; color: #aaa;">🎮 Género: ${game.genre}</p>`;

                if (game.hasMod && game.linkMod) {
                    buttonsHTML += `<a href="${game.linkMod}" target="_blank" rel="noopener noreferrer" style="display: block; background: #7209b7; color: #fff; padding: 8px; border-radius: 6px; text-decoration: none; text-align: center; font-weight: bold; font-size: 0.9rem;">🔓 Descargar APK Mod</a>`;
                }

                if (game.customButtons && Array.isArray(game.customButtons)) {
                    game.customButtons.forEach(btn => {
                        if (btn.text && btn.link) {
                            const btnColor = btn.color || '#ff7700';
                            buttonsHTML += `<a href="${btn.link}" target="_blank" rel="noopener noreferrer" style="display: block; background-color: ${btnColor}; color: #fff; padding: 8px; border-radius: 6px; text-decoration: none; text-align: center; font-weight: bold; font-size: 0.9rem;">⭐ ${btn.text}</a>`;
                        }
                    });
                }

                card.innerHTML = `
                    <div style="width: 100%; height: 150px; background: #000; border-radius: 8px; overflow: hidden;">
                        <img src="${game.img}" alt="${game.title}" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 5px;">
                        <h3 style="margin: 0; font-size: 1.2rem; color: #fff;">${game.title}</h3>
                        ${detailsHTML}
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: auto;">
                        ${buttonsHTML}
                    </div>
                `;
                gameGrid.appendChild(card);
            });
        }

        renderAllContentOnGrid();

        [closeDynamicModal, closeDynBtn].forEach(el => {
            if (el) {
                el.addEventListener('click', () => {
                    dynamicModal.style.display = 'none';
                });
            }
        });

        if (floatingBtn) {
            floatingBtn.addEventListener('click', () => {
                const ingreso = prompt("Contraseña de Administrador:");
                if (ingreso === PASSWORD) {
                    adminModal.style.display = 'flex';
                    resetGameForm();
                    renderAdminGames();
                } else if (ingreso !== null) {
                    alert("Contraseña incorrecta.");
                }
            });
        }

        if (closeAdminModal) {
            closeAdminModal.addEventListener('click', () => {
                adminModal.style.display = 'none';
            });
        }

        quickAddForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = parseInt(editIndexInput.value);
            const newGame = {
                title: document.getElementById('qaTitle').value,
                genre: document.getElementById('qaGenre').value,
                img: document.getElementById('qaImg').value,
                hasPc: document.getElementById('qaHasPc').checked,
                weightPc: document.getElementById('qaWeightPc').value,
                linkPc: document.getElementById('qaLinkPc').value,
                hasAndroid: document.getElementById('qaHasAndroid').checked,
                weightAndroid: document.getElementById('qaWeightAndroid').value,
                linkAndroid: document.getElementById('qaLinkAndroid').value,
                hasMod: document.getElementById('qaHasMod').checked,
                linkMod: document.getElementById('qaLinkMod').value,
                customButtons: [...currentCustomButtons]
            };

            let customGames = JSON.parse(localStorage.getItem('matateo_custom_games') || '[]');

            if (index === -1) {
                customGames.push(newGame);
                alert("¡Juego guardado con éxito!");
            } else {
                customGames[index] = newGame;
                alert("¡Juego actualizado con éxito!");
                resetGameForm();
            }

            localStorage.setItem('matateo_custom_games', JSON.stringify(customGames));
            quickAddForm.reset();
            currentCustomButtons = [];
            renderCustomButtonsFormList();
            editIndexInput.value = "-1";
            renderAdminGames();
            renderAllContentOnGrid();
        });

        cancelEditBtn.addEventListener('click', () => {
            resetGameForm();
            quickAddForm.reset();
            currentCustomButtons = [];
            renderCustomButtonsFormList();
            editIndexInput.value = "-1";
        });

        function resetGameForm() {
            formSectionTitle.textContent = "Agregar nuevo juego individual:";
            saveGameBtn.textContent = "Guardar juego";
            saveGameBtn.style.backgroundColor = "#38b000";
            cancelEditBtn.style.display = "none";
            currentCustomButtons = [];
            renderCustomButtonsFormList();
        }

        function renderAdminGames() {
            let customGames = JSON.parse(localStorage.getItem('matateo_custom_games') || '[]');
            adminGamesList.innerHTML = '';
            if (customGames.length === 0) {
                adminGamesList.innerHTML = '<p style="color: #888; font-size: 0.9rem;">No hay juegos guardados.</p>';
                return;
            }
            customGames.forEach((game, index) => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.background = '#18181c';
                item.style.padding = '8px';
                item.style.borderRadius = '4px';
                item.innerHTML = `
                    <span style="font-size: 0.9rem;">${game.title}</span>
                    <div style="display: flex; gap: 5px;">
                        <button data-index="${index}" class="edit-custom-btn" style="background: #00b4d8; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Editar</button>
                        <button data-index="${index}" class="del-custom-btn" style="background: #e63946; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Eliminar</button>
                    </div>
                `;
                adminGamesList.appendChild(item);
            });

            document.querySelectorAll('.edit-custom-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    const game = customGames[idx];
                    
                    document.getElementById('qaTitle').value = game.title;
                    document.getElementById('qaGenre').value = game.genre;
                    document.getElementById('qaImg').value = game.img;
                    
                    document.getElementById('qaHasPc').checked = game.hasPc;
                    document.getElementById('qaWeightPc').value = game.weightPc || '';
                    document.getElementById('qaLinkPc').value = game.linkPc || '';
                    
                    document.getElementById('qaHasAndroid').checked = game.hasAndroid;
                    document.getElementById('qaWeightAndroid').value = game.weightAndroid || '';
                    document.getElementById('qaLinkAndroid').value = game.linkAndroid || '';
                    
                    document.getElementById('qaHasMod').checked = game.hasMod;
                    document.getElementById('qaLinkMod').value = game.linkMod || '';

                    currentCustomButtons = game.customButtons ? JSON.parse(JSON.stringify(game.customButtons)) : [];
                    renderCustomButtonsFormList();

                    editIndexInput.value = idx;
                    formSectionTitle.textContent = `Editando: ${game.title}`;
                    saveGameBtn.textContent = "Actualizar juego";
                    saveGameBtn.style.backgroundColor = "#00b4d8";
                    cancelEditBtn.style.display = "block";
                    
                    adminGamesList.scrollTop = 0;
                });
            });

            document.querySelectorAll('.del-custom-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    customGames.splice(idx, 1);
                    localStorage.setItem('matateo_custom_games', JSON.stringify(customGames));
                    if (parseInt(editIndexInput.value) === idx) {
                        resetGameForm();
                        quickAddForm.reset();
                        currentCustomButtons = [];
                        renderCustomButtonsFormList();
                        editIndexInput.value = "-1";
                    }
                    renderAdminGames();
                    renderAllContentOnGrid();
                });
            });
        }

        collectionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = parseInt(editColIndexInput.value);
            const colTitle = document.getElementById('colTitle').value.trim();
            const colGenre = document.getElementById('colGenre').value.trim();
            const colMainImg = document.getElementById('colMainImg').value.trim();

            let collections = JSON.parse(localStorage.getItem('matateo_collections_single_img') || '[]');

            const newCollectionData = {
                title: colTitle,
                genre: colGenre,
                mainImg: colMainImg,
                subgames: [...currentCollectionSubgames]
            };

            if (index === -1) {
                collections.push(newCollectionData);
                alert("¡Colección creada con éxito!");
            } else {
                collections[index] = newCollectionData;
                alert("¡Colección actualizada con éxito!");
                resetColForm();
            }

            localStorage.setItem('matateo_collections_single_img', JSON.stringify(collections));
            collectionForm.reset();
            currentCollectionSubgames = [];
            renderSubgamesFormList();
            editColIndexInput.value = "-1";
            renderAdminCollections();
            renderAllContentOnGrid();
        });

        cancelColEditBtn.addEventListener('click', () => {
            resetColForm();
            collectionForm.reset();
            currentCollectionSubgames = [];
            renderSubgamesFormList();
            editColIndexInput.value = "-1";
        });

        function resetColForm() {
            formColTitle.textContent = "Crear Nueva Colección:";
            saveColBtn.textContent = "Guardar Colección";
            saveColBtn.style.backgroundColor = "#38b000";
            cancelColEditBtn.style.display = "none";
            currentCollectionSubgames = [];
            renderSubgamesFormList();
        }

        function renderAdminCollections() {
            let collections = JSON.parse(localStorage.getItem('matateo_collections_single_img') || '[]');
            adminCollectionsList.innerHTML = '';
            if (collections.length === 0) {
                adminCollectionsList.innerHTML = '<p style="color: #888; font-size: 0.9rem;">No hay colecciones creadas.</p>';
                return;
            }
            collections.forEach((col, index) => {
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.background = '#18181c';
                item.style.padding = '8px';
                item.style.borderRadius = '4px';
                item.innerHTML = `
                    <span style="font-size: 0.9rem; font-weight: bold;">📁 ${col.title} (${col.subgames.length} juegos)</span>
                    <div style="display: flex; gap: 5px;">
                        <button data-index="${index}" class="edit-col-btn" style="background: #00b4d8; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Editar</button>
                        <button data-index="${index}" class="del-col-btn" style="background: #e63946; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">Eliminar</button>
                    </div>
                `;
                adminCollectionsList.appendChild(item);
            });

            document.querySelectorAll('.edit-col-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    const col = collections[idx];
                    
                    document.getElementById('colTitle').value = col.title;
                    document.getElementById('colGenre').value = col.genre;
                    document.getElementById('colMainImg').value = col.mainImg;
                    
                    currentCollectionSubgames = [...col.subgames];
                    renderSubgamesFormList();

                    editColIndexInput.value = idx;
                    formColTitle.textContent = `Editando colección: ${col.title}`;
                    saveColBtn.textContent = "Actualizar Colección";
                    saveColBtn.style.backgroundColor = "#00b4d8";
                    cancelColEditBtn.style.display = "block";
                });
            });

            document.querySelectorAll('.del-col-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    collections.splice(idx, 1);
                    localStorage.setItem('matateo_collections_single_img', JSON.stringify(collections));
                    
                    if (parseInt(editColIndexInput.value) === idx) {
                        resetColForm();
                        collectionForm.reset();
                        editColIndexInput.value = "-1";
                    }
                    renderAdminCollections();
                    renderAllContentOnGrid();
                });
            });
        }
    });
</script>