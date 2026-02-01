import { db, auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Verificar autenticação
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    });
});

// Cadastrar Produto
const form = document.getElementById('product-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const price = parseFloat(document.getElementById('price').value);
    const platform = document.getElementById('platform').value;
    const imageUrl = document.getElementById('imageUrl').value;
    const affiliateLink = document.getElementById('affiliateLink').value;

    const submitBtn = form.querySelector('button');
    submitBtn.textContent = "Salvando...";
    submitBtn.disabled = true;

    try {
        await addDoc(collection(db, "products"), {
            title,
            price,
            platform,
            imageUrl,
            affiliateLink,
            createdAt: serverTimestamp()
        });
        
        alert("Produto cadastrado com sucesso!");
        form.reset();
    } catch (error) {
        console.error("Erro ao cadastrar: ", error);
        alert("Erro ao salvar produto.");
    } finally {
        submitBtn.textContent = "Cadastrar Produto";
        submitBtn.disabled = false;
    }
});

// Listar produtos para exclusão rápida (Realtime)
const listContainer = document.getElementById('admin-list');
const q = query(collection(db, "products"), orderBy("createdAt", "desc"), limit(10));

onSnapshot(q, (snapshot) => {
    listContainer.innerHTML = "";
    snapshot.forEach((docSnap) => {
        const prod = docSnap.data();
        const li = document.createElement('li');
        li.className = "flex justify-between items-center border-b pb-2";
        li.innerHTML = `
            <div class="flex items-center">
                <img src="${prod.imageUrl}" class="w-10 h-10 object-cover rounded mr-3">
                <span class="text-sm font-medium truncate w-48">${prod.title}</span>
            </div>
            <button class="text-red-500 hover:text-red-700 text-sm delete-btn" data-id="${docSnap.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        listContainer.appendChild(li);
    });

    // Adicionar eventos de delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            if(confirm("Tem certeza que deseja apagar este produto?")) {
                const id = e.currentTarget.getAttribute('data-id');
                await deleteDoc(doc(db, "products", id));
            }
        });
    });
});