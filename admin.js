import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Auth Check
onAuthStateChanged(auth, (user) => {
    if (!user) window.location.href = "login.html";
});

// Logout
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => window.location.href = "login.html");
    });
}

// Cadastro
const form = document.getElementById('product-form');
if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Pegando os valores (incluindo a nova Categoria)
        const title = document.getElementById('title').value;
        const price = document.getElementById('price').value;
        const platform = document.getElementById('platform').value;
        const category = document.getElementById('category').value; // NOVO
        const imageUrl = document.getElementById('imageUrl').value;
        const affiliateLink = document.getElementById('affiliateLink').value;

        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Salvando...';

        try {
            await addDoc(collection(db, "products"), {
                title,
                price: parseFloat(price),
                platform,
                category, // Salvando no banco
                imageUrl,
                affiliateLink,
                createdAt: serverTimestamp()
            });
            alert("✅ Produto publicado com sucesso!");
            form.reset();
        } catch (error) {
            alert("Erro ao salvar: " + error.message);
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

// Lista Simples para Delete
const listContainer = document.getElementById('admin-list');
if (listContainer) {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(20));
    onSnapshot(q, (snapshot) => {
        listContainer.innerHTML = "";
        snapshot.forEach((docSnap) => {
            const p = docSnap.data();
            listContainer.innerHTML += `
                <li class="flex justify-between items-center p-3 bg-gray-50 rounded border hover:bg-gray-100">
                    <div class="flex items-center gap-3">
                        <img src="${p.imageUrl}" class="w-10 h-10 rounded object-cover">
                        <div>
                            <p class="text-sm font-bold text-gray-700 line-clamp-1 w-48">${p.title}</p>
                            <p class="text-xs text-gray-500">${p.platform} - R$ ${p.price}</p>
                        </div>
                    </div>
                    <button onclick="window.deleteProduct('${docSnap.id}')" class="text-red-500 hover:text-red-700 p-2">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </li>
            `;
        });
    });
}

window.deleteProduct = async (id) => {
    if (confirm("Tem certeza que deseja apagar?")) {
        await deleteDoc(doc(db, "products", id));
    }
};
