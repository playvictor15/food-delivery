import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Verificar se o usuário está logado
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

// 2. Botão de Sair
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => { window.location.href = "login.html"; });
    });
}

// 3. Cadastrar Produto
const productForm = document.getElementById('product-form');

if (productForm) {
    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const platform = document.getElementById('platform').value;
        const imageUrl = document.getElementById('imageUrl').value;
        const affiliateLink = document.getElementById('affiliateLink').value;

        const btn = productForm.querySelector('button');
        btn.disabled = true;
        btn.innerText = "Salvando...";

        try {
            await addDoc(collection(db, "products"), {
                title: title,
                price: parseFloat(price),
                platform: platform,
                imageUrl: imageUrl,
                affiliateLink: affiliateLink,
                createdAt: serverTimestamp()
            });

            alert("Produto salvo com sucesso!");
            productForm.reset();
        } catch (error) {
            console.error("Erro detalhado:", error);
            alert("Erro ao salvar: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerText = "Cadastrar Produto";
        }
    });
}

// 4. Listagem em tempo real para deletar
const listContainer = document.getElementById('admin-list');
if (listContainer) {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(15));
    onSnapshot(q, (snapshot) => {
        listContainer.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const prod = docSnap.data();
            const li = document.createElement('li');
            li.className = "flex justify-between items-center bg-gray-50 p-2 rounded border";
            li.innerHTML = `
                <span class="text-sm truncate w-40">${prod.title}</span>
                <button class="text-red-500 p-1" onclick="window.deleteProduct('${docSnap.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            listContainer.appendChild(li);
        });
    });
}

// Função global para deletar (necessária por causa do type="module")
window.deleteProduct = async (id) => {
    if (confirm("Deseja excluir este produto?")) {
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (error) {
            alert("Erro ao excluir!");
        }
    }
};
